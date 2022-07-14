import { Grid, Paper, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import formatDatePosted from "../lib/formatDatePosted";
import { Comment } from "../API";

type Props = {
  comment: Comment;
};

export default function PostComment({ comment }: Props): ReactElement {
  console.log("in post comment");

  console.log("comment:", comment);
  return (
    <Paper style={{ width: "100%", minHeight: 128, padding: 16, marginTop: 32 }} elevation={2}>
      <Grid container spacing={1} direction="row">
        <Grid item>
          <Typography variant="body1">
            {comment.owner} - {formatDatePosted(comment.createdAt)} hours ago
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">{comment.content}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
