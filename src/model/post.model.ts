import { Post } from "@prisma/client";

export type CreatePostRequest = {
  title: string;
  content: string;
}

export type UpdatePostRequest = {
  postId: number;
  title: string;
  content: string;
}

export type PostResponse = {
  postId: number;
  username: string;
  title: string;
  content: string;
}

export function toPostResponse(post: Post): PostResponse {
  return {
    postId: post.id,
    username: post.userUsername,
    title: post.title,
    content: post.content
  }
}
