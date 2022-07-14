import * as React from "react";
import { ReactElement } from "react";
import { Container, ContainerProps } from "@mui/material";

export const MainContainer = (props: ContainerProps): ReactElement => {
  return (
    <Container
      {...props}
      sx={{ marginTop: (theme) => theme.spacing(5), marginBottom: (theme) => theme.spacing(9) }}
    >
      {props.children}
    </Container>
  );
};
