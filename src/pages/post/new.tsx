import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { CreatePostInput, CreatePostMutation } from "../../API";
import { API, Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import ImageDropzone from "../../components/ImageDropzone";
import { MainContainer } from "../../components/MainContainer";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { createPost } from "../../graphql/mutations";

type Props = {};

interface IFormInput {
  title: string;
  content: string;
}

export default function NewPost({}: Props): React.ReactElement {
  const [file, setFile] = useState<File>();
  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    console.log(file);
    console.log(data);

    // User uploaded file
    if (file) {
      // Send a request to upload to the S3 Bucket.
      try {
        const imagePath = uuidv4();

        await Storage.put(imagePath, file, {
          contentType: file.type, // contentType is optional
        });

        const createNewPostInput: CreatePostInput = {
          title: data.title,
          contents: data.content,
          image: imagePath,
        };

        const createNewPost = (await API.graphql({
          query: createPost,
          variables: { input: createNewPostInput },
          authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        })) as { data: CreatePostMutation };

        console.log("New post created successfully:", createNewPost);

        router.push(`/post/${createNewPost.data.createPost.id}`);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    } else {
      const createNewPostWithoutImageInput: CreatePostInput = {
        title: data.title,
        contents: data.content,
      };

      const createNewPostWithoutImage = (await API.graphql({
        query: createPost,
        variables: { input: createNewPostWithoutImageInput },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      })) as { data: CreatePostMutation };

      router.push(`/post/${createNewPostWithoutImage.data.createPost.id}`);
    }
  };

  return (
    <MainContainer maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container spacing={4} direction="column">
          {/* Title of the post */}
          <Grid item>
            <TextField
              variant="outlined"
              id="title"
              label="Post Title"
              type="text"
              fullWidth
              error={errors.title ? true : false}
              helperText={errors.title ? errors.title.message : null}
              {...register("title", {
                required: { value: true, message: "Please enter a title." },
                maxLength: {
                  value: 120,
                  message: "Please enter a title that is 120 characters or less.",
                },
              })}
            />
          </Grid>
          {/* Contents of the post */}
          <Grid item>
            <TextField
              variant="outlined"
              id="content"
              label="Post Content"
              type="text"
              fullWidth
              multiline
              error={errors.content ? true : false}
              helperText={errors.content ? errors.content.message : null}
              {...register("content", {
                required: {
                  value: true,
                  message: "Please enter some content for your post.",
                },
                maxLength: {
                  value: 1000,
                  message: "Please make sure your content is 1000 characters or less.",
                },
              })}
            />
          </Grid>
          {/* Optional Image of the post */}
          <Grid item>
            <ImageDropzone file={file} setFile={setFile} />
          </Grid>

          {/* Button to submit the form with those contents */}
          <Button variant="contained" type="submit">
            Create Post
          </Button>
        </Grid>
      </form>
    </MainContainer>
  );
}
