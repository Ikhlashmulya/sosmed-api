import { z } from "zod";

export class CommentValidation {
  static readonly CREATE = z.object({
    content: z.string().min(1).max(255),
    postId: z.number(),
  });

  static readonly UPDATE = z.object({
    content: z.string().min(1).max(255),
    postId: z.number(),
    commentId: z.number(),
  });

  static readonly DELETE = z.object({
    postId: z.number(),
    commentId: z.number(),
  });

  static readonly FIND = z.object({
    postId: z.number(),
    commentId: z.number(),
  });

  static readonly FIND_BY_POST_ID = z.object({
    postId: z.number(),
    page: z.number(),
    size: z.number().max(100),
  });
}
