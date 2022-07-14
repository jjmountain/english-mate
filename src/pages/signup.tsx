import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "../context/AuthContext";
import { CognitoUser } from "@aws-amplify/auth";
import { useRouter } from "next/router";

interface IFormInputs {
  username: string;
  password: string;
  email: string;
  code: string;
}

export default function Signup() {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      if (showCode) {
        confirmSignUp(data);
      } else {
        await signUpWithAws(data);
        setShowCode(true);
      }
    } catch (err) {
      console.log(err);
      setSignUpError(err.message);
      setOpen(true);
    }
  };

  console.log(errors, "errors");

  async function signUpWithAws(data: IFormInputs): Promise<CognitoUser> {
    const { username, password, email } = data;
    console.log("data", data);
    try {
      const { user } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log("Signed up a user:", user);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async function confirmSignUp(data: IFormInputs) {
    const { username, password, code } = data;
    try {
      await Auth.confirmSignUp(username, code);
      const amplifyUser = await Auth.signIn(username, password);
      console.log("Successs, singed in a user", amplifyUser);
      if (amplifyUser) {
        router.push(`/`);
      } else {
        throw new Error("Something went wrong :'(");
      }
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  console.log("The value of the user from the hook is", user);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        container
        direction="column"
        spacing={3}
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item>
          <TextField
            id="username"
            label="Username"
            type="text"
            variant="outlined"
            error={errors.username ? true : false}
            helperText={errors.username ? errors.username.message : null}
            {...register("username", {
              required: { value: true, message: "Please enter a username" },
              minLength: {
                value: 3,
                message: "Please enter a username between 3-16 characters",
              },
              maxLength: {
                value: 16,
                message: "Please enter a username between 3-16 characters",
              },
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            error={errors.email ? true : false}
            helperText={errors.email ? errors.email.message : null}
            {...register("email", {
              required: { value: true, message: "Please enter a valid email" },
            })}
          />
        </Grid>
        <Grid item>
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            error={errors.password ? true : false}
            helperText={errors.password ? errors.password.message : null}
            {...register("password", {
              required: {
                value: true,
                message: "Please enter a valid password",
              },
              minLength: {
                value: 8,
                message: "Please enter a stronger password",
              },
            })}
          />
        </Grid>
        {showCode && (
          <Grid item>
            <TextField
              id="code"
              label="Verication Code"
              type="text"
              variant="outlined"
              error={errors.code ? true : false}
              helperText={errors.code ? errors.code.message : null}
              {...register("code", {
                required: {
                  value: true,
                  message: "Please enter a code",
                },
                minLength: {
                  value: 6,
                  message: "Please enter a 6 digit code",
                },
                maxLength: {
                  value: 6,
                  message: "Please enter a 6 digit code",
                },
              })}
            />
          </Grid>
        )}
        <Grid item>
          <Button variant="contained" type="submit">
            {showCode ? "Confirm Code" : "Sign up"}
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {signUpError}
        </Alert>
      </Snackbar>
    </form>
  );
}
