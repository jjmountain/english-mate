import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUser } from "../context/AuthContext";

interface IFormInputs {
  username: string;
  password: string;
  email: string;
}

export default function Signup() {
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [signUpError, setSignUpError] = useState<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      signUpWithAws(data);
    } catch (err) {
      console.log(err);
      setSignUpError(err.message);
      setOpen(true);
    }
  };

  console.log(errors, "errors");

  async function signUpWithAws(data: IFormInputs) {
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
    } catch (err) {
      throw err;
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
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <TextField
            id="username"
            label="username"
            type="text"
            variant="standard"
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
            label="email"
            type="email"
            variant="standard"
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
            label="password"
            type="password"
            variant="standard"
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
        <Grid item>
          <Button variant="contained" type="submit">
            Sign up
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {signUpError}
        </Alert>
      </Snackbar>
    </form>
  );
}
