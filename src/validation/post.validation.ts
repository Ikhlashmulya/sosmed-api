import { z } from "zod";

export class PostValidation {
  static readonly CREATE = z.object({
    title: z.string().min(1).max(100),
    content: z.string().min(1).max(255)
  });

  static readonly UPDATE = z.object({
    postId: z.number(),
    title: z.string().min(1).max(100),
    content: z.string().min(1).max(255)
  });
}
