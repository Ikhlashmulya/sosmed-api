import { Comment, User } from "@prisma/client";
import { Paging } from "./paging.model";

export type CreateCommentRequest = {
  content: string;
  postId: number;
};

export type UpdateCommentRequest = {
  commentId: number;
  content: string;
  postId: number;
};

export type DeleteCommentRequest = {
  commentId: number;
  postId: number;
};

export type FindCommentsByPostIdRequest = {
  postId: number;
} & Paging;

export type FindCommentByIdRequest = DeleteCommentRequest;

export type CommentResponse = {
  commentId: number;
  username: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toCommentResponse(comment: Comment): CommentResponse {
  return {
    commentId: comment.id,
    username: comment.userUsername,
    content: comment.content,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}
