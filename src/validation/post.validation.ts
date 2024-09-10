import { z } from "zod";

export class PostValidation {
  static readonly CREATE = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1).max(255),
  });

  static readonly UPDATE = z.object({
    postId: z.number(),
    title: z.string().min(1).max(100),
    content: z.string().min(1).max(255),
  });

  static readonly FIND_BY_USERNAME = z.object({
    username: z.string().min(1).max(100),
    size: z.number().max(100),
    page: z.number(),
  });

  static readonly GET_OR_SEARCH_POSTS = z.object({
    search: z.string().optional(),
    size: z.number().max(100),
    page: z.number(),
  });
}
