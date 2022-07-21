import { Box, ButtonBase, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import {
  Post,
  CreateVoteInput,
  CreateVoteMutation,
  UpdateVoteInput,
  UpdateVoteMutation,
} from "../API";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import formatDatePosted from "../lib/formatDatePosted";
import { createVote, updateVote } from "../graphql/mutations";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { API, Auth, Storage } from "aws-amplify";
import { useUser } from "../context/AuthContext";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";

interface Props {
  post: Post;
}

export default function PostPreview({ post }: Props): ReactElement {
  const router = useRouter();
  const { user } = useUser();

  const [postImage, setPostImage] = useState<string | undefined>(undefined);

  const [existingVote, setExistingVote] = useState<string | undefined>(undefined);
  const [existingVoteId, setExistingVoteId] = useState<string | undefined>(undefined);

  const [upvotes, setUpvotes] = useState<number>(
    post.votes.items ? post.votes.items.filter((v) => v.vote === "upvote").length : 0
  );

  const [downvotes, setDownvotes] = useState<number>(
    post.votes.items ? post.votes.items.filter((v) => v.vote === "downvote").length : 0
  );

  useEffect(() => {
    if (user) {
      const tryFindVote = post.votes.items?.find((v) => v.owner === user.getUsername());

      if (tryFindVote) {
        setExistingVote(tryFindVote.vote);
        setExistingVoteId(tryFindVote.id);
      }
    }
  }, [user]);

  useEffect(() => {
    async function getImageFromStorage() {
      try {
        console.log(post, "post");
        const signedURL = await Storage.get(post.image); // get key from Storage.list
        console.log("Found Image:", signedURL);
        // @ts-ignore
        setPostImage(signedURL);
      } catch (error) {
        console.log("No image found.", error);
      }
    }

    getImageFromStorage();
  }, []);

  const addVote = async (voteType: string) => {
    if (!user) {
      alert("no user");
      return;
    }
    if (existingVote && existingVote != voteType) {
      const updateVoteInput: UpdateVoteInput = {
        id: existingVoteId,
        vote: voteType,
        postID: post.id,
      };

      const updateThisVote = (await API.graphql({
        query: updateVote,
        variables: { input: updateVoteInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: UpdateVoteMutation };
      // if they're changing their vote...
      // updateVote rather than create vote.

      if (voteType === "upvote") {
        setUpvotes(upvotes + 1);
        setDownvotes(downvotes - 1);
      }

      if (voteType === "downvote") {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(updateThisVote.data.updateVote.id);
      console.log("Updated vote:", updateThisVote);
    }

    if (!existingVote) {
      const createNewVoteInput: CreateVoteInput = {
        vote: voteType,
        postID: post.id,
      };

      const createNewVote = (await API.graphql({
        query: createVote,
        variables: { input: createNewVoteInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: CreateVoteMutation };

      if (createNewVote.data.createVote.vote === "downvote") {
        setDownvotes(downvotes + 1);
      }
      if (createNewVote.data.createVote.vote === "upvote") {
        setUpvotes(upvotes + 1);
      }
      setExistingVote(voteType);
      setExistingVoteId(createNewVote.data.createVote.id);
      console.log("Created vote:", createNewVote);
    }
  };

  return (
    <Paper elevation={3}>
      <Grid container sx={{ marginBottom: 4, paddingY: 1, width: "100%", display: "flex" }}>
        {/* upvote / downvote */}
        <Grid item>
          <Stack paddingX={1} spacing={1}>
            <IconButton color="inherit" onClick={() => addVote("upvote")}>
              <ArrowUpwardIcon style={{ maxWidth: 24 }} />
            </IconButton>
            <Typography align="center" variant="h6">
              {upvotes - downvotes}
            </Typography>

            <IconButton color="inherit" onClick={() => addVote("downvote")}>
              <ArrowDownwardIcon style={{ maxWidth: 24 }} />
            </IconButton>
          </Stack>
        </Grid>

        {/* content preview */}
        <Grid item xs={10} sx={{ padding: 1 }}>
          <ButtonBase
            sx={{ width: "100%", justifyContent: "flex-start" }}
            disableRipple
            onClick={() => router.push(`/post/${post.id}`)}
          >
            <Stack spacing={3} sx={{ width: "100%" }}>
              <Typography textAlign="left" variant="body2">
                Posted by <b>{post.owner}</b>{" "}
                {formatDatePosted(post.createdAt) === "1"
                  ? `${formatDatePosted(post.createdAt)} hour ago`
                  : `${formatDatePosted(post.createdAt)} hours ago`}
              </Typography>
              <Typography textAlign="left" variant="h2">
                {post.title}
              </Typography>
              <Typography textAlign="left" variant="body1">
                {post.contents}
              </Typography>
              <Box
                sx={{
                  cursor: "pointer",
                  marginTop: 5,
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {post.image && postImage && (
                  // <Link href={postImage}>
                  <Image
                    src={postImage}
                    width={600}
                    height={600}
                    loading="eager"
                    // layout="intrinsic"
                    objectFit="contain"
                    objectPosition="relative"
                  />
                  // </Link>
                )}
              </Box>
            </Stack>
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
}
