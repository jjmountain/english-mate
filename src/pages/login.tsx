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

export default function Login() {
  const [open, setOpen] = useState(false);
  const [signInError, setSignInError] = useState<string>("");
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      await Auth.signIn(data.username, data.password);
      router.push("/");
    } catch (err) {
      setSignInError(err.message);
      setOpen(true);
    }
  };

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
            {...register("username")}
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
                message: "Please enter a password",
              },
            })}
          />
        </Grid>

        <Grid item>
          <Button variant="contained" type="submit">
            Sign in
          </Button>
        </Grid>
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {signInError}
        </Alert>
      </Snackbar>
    </form>
  );
}
