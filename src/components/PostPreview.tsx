import { Box, ButtonBase, Grid, IconButton, Paper, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import { Post } from "../API";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import formatDatePosted from "../lib/formatDatePosted";
import Image from "next/image";
import { useRouter } from "next/router";

interface Props {
  post: Post;
}

export default function PostPreview({ post }: Props): ReactElement {
  const router = useRouter();
  return (
    <Paper elevation={3}>
      <Grid
        container
        direction="row"
        alignItems="flex-start"
        justifyContent="flex-start"
        spacing={3}
        style={{ padding: 8, marginTop: 24 }}
        wrap="nowrap"
      >
        {/* upvote / downvote */}
        <Grid item xs="auto" alignItems="center">
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <IconButton color="inherit">
                <ArrowUpwardIcon style={{ maxWidth: 24 }} />
              </IconButton>
            </Grid>
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography align="center" variant="h6">
                    {(post.upvotes - post.downvotes).toString()}
                  </Typography>
                  <Typography variant="body2">votes</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton color="inherit">
                <ArrowDownwardIcon style={{ maxWidth: 24 }} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        {/* content preview */}
        <Grid item>
          <ButtonBase disableRipple onClick={() => router.push(`/post/${post.id}`)}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item style={{ maxHeight: 32, overflowY: "hidden", overflowX: "hidden" }}>
                <Typography variant="body1">
                  Posted by <b>{post.owner}</b>{" "}
                  {formatDatePosted(post.createdAt) === "1"
                    ? `${formatDatePosted(post.createdAt)} hour ago`
                    : `${formatDatePosted(post.createdAt)} hours ago`}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h2">{post.title}</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">{post.contents}</Typography>
              </Grid>
              {!post.image && (
                <Grid item style={{ marginTop: 24, marginRight: 24 }}>
                  <Image
                    src={`http://source.unsplash.com/random/980x540`}
                    height={540}
                    width={980}
                    layout="intrinsic"
                  ></Image>
                </Grid>
              )}
            </Grid>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}
