import { Post } from "@prisma/client";
import { Paging } from "./paging.model";

export type CreatePostRequest = {
  title: string;
  content: string;
};

export type UpdatePostRequest = {
  postId: number;
  title: string;
  content: string;
};

export type PostResponse = {
  postId: number;
  username: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type FindPostByUsernameRequest = {
  username: string;
} & Paging;

export type GetOrSearchPostsRequest = {
  search?: string;
} & Paging;

export function toPostResponse(post: Post): PostResponse {
  return {
    postId: post.id,
    username: post.userUsername,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
