import { Container, Typography } from "@mui/material";
import { useUser } from "../context/AuthContext";
import { listPosts } from "../graphql/queries";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import { Post, ListPostsQuery } from "../API";
import React from "react";
import PostPreview from "../components/PostPreview";
import { MainContainer } from "../components/MainContainer";

export default function Home() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPostsFromApi = async (): Promise<Post[]> => {
      const allPosts = (await API.graphql({ query: listPosts })) as {
        data: ListPostsQuery;
        errors: any[];
      };
      if (allPosts.data) {
        setPosts(allPosts.data.listPosts.items as Post[]);
        return allPosts.data.listPosts.items as Post[];
      } else {
        throw new Error("Could not get posts");
      }
    };

    fetchPostsFromApi();
  }, []);

  console.log("User:", user);
  console.log("Posts:", posts);

  return (
    <MainContainer maxWidth="md">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </MainContainer>
  );
}
