import { Typography } from "@mui/material";
import { Amplify, API, Auth, withSSRContext } from "aws-amplify";

export default function Home() {
  return <Typography variant="h1">Hello World</Typography>;
}
