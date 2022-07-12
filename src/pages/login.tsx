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
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);
  const [signInError, setSignInError] = useState<string>("");
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>();

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const amplifyUser = await Auth.signIn(data.username, data.password);
    if (amplifyUser) {
      router.push("/");
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
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <TextField
            id="username"
            label="username"
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
            id="password"
            label="password"
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
