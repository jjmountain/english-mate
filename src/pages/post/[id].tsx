import React, { ReactElement, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { API, withSSRContext } from "aws-amplify";
import { listPosts, getPost } from "../../graphql/queries";
import { createComment } from "../../graphql/mutations";
import {
  ListPostsQuery,
  GetPostQuery,
  Post,
  CreateCommentInput,
  CreateCommentMutation,
  Comment,
} from "../../API";
import PostPreview from "../../components/PostPreview";
import PostComment from "../../components/PostComment";
import { MainContainer } from "../../components/MainContainer";
import { Grid, TextField, Button, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { useRouter } from "next/router";
import { useUser } from "../../context/AuthContext";
import Link from "next/link";

type Props = {
  post: Post;
};

interface IFormInput {
  comment: string;
}

export default function IndividualPost({ post }: Props): ReactElement {
  const [comments, setComments] = useState<Comment[]>(post.comments.items as Comment[]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IFormInput>();

  const { user } = useUser();
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(data);

    const newCommentInput: CreateCommentInput = {
      postID: post.id,
      content: data.comment,
    };
    // Add Comment Mutation
    const createNewComment = (await API.graphql({
      query: createComment,
      variables: { input: newCommentInput },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    })) as { data: CreateCommentMutation };

    setComments([...comments, createNewComment.data.createComment as Comment]);
    reset();
  };

  return (
    <MainContainer maxWidth="md">
      <>
        <PostPreview post={post} />
        {/* Start rendering comments */}
        {user ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            style={{ marginTop: 32, marginBottom: 32 }}
          >
            <Grid container spacing={2} direction="row" alignItems="flex-start">
              <Grid item sx={{ flexGrow: 1 }}>
                <TextField
                  variant="outlined"
                  id="comment"
                  label="Add A Comment"
                  type="text"
                  multiline
                  fullWidth
                  error={errors.comment ? true : false}
                  helperText={errors.comment ? errors.comment.message : null}
                  {...register("comment", {
                    required: { value: true, message: "Please enter a comment." },
                    maxLength: {
                      value: 240,
                      message: "Please enter a comment under 240 characters.",
                    },
                  })}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item sx={{ position: "relative" }}>
                <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 1 }}>
                  Add Comment
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Typography>
            <Link href="/login">Log in</Link> to post a comment
          </Typography>
        )}

        {comments
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((comment) => (
            <PostComment key={comment.id} comment={comment} />
          ))}
      </>
    </MainContainer>
  );
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Call an external API endpoint to get posts.
  const SSR = withSSRContext();

  const postsQuery = (await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id,
    },
  })) as { data: GetPostQuery };

  // By returning { props: { posts } }, the Individual Post component
  // will receive `post` as a prop at build time
  return {
    props: {
      post: postsQuery.data.getPost as Post,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 1, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext();

  const response = (await SSR.API.graphql({ query: listPosts })) as {
    data: ListPostsQuery;
    errors: any[];
  };

  // Get the paths we want to pre-render based on posts
  const paths = response.data.listPosts.items.map((post) => ({
    params: { id: post.id },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
};
