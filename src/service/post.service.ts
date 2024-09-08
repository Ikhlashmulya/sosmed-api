import { Post, PrismaClient, User } from "@prisma/client";
import {
  CreatePostRequest,
  PostResponse,
  toPostResponse,
  UpdatePostRequest,
} from "../model/post.model";
import { Validation } from "../validation/validation";
import { PostValidation } from "../validation/post.validation";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../application/database";

export class PostService {
  async create(user: User, request: CreatePostRequest): Promise<PostResponse> {
    const createRequest = Validation.validate(PostValidation.CREATE, request);

    const post = await prisma.post.create({
      data: {
        ...createRequest,
        ...{ userUsername: user.username },
      },
    });

    return toPostResponse(post);
  }

  async update(user: User, request: UpdatePostRequest): Promise<PostResponse> {
    const { postId, ...updateRequest } = Validation.validate(
      PostValidation.UPDATE,
      request,
    );

    let post = await this.checkPostMustExists(user.username, postId);

    post = await prisma.post.update({
      data: updateRequest,
      where: {
        id: postId,
        userUsername: user.username,
      },
    });

    return toPostResponse(post);
  }

  async delete(user: User, postId: number): Promise<boolean> {
    await this.checkPostMustExists(user.username, postId);
    await prisma.post.delete({
      where: {
        id: postId,
        userUsername: user.username,
      },
    });

    return true;
  }

  async checkPostMustExists(username: string, postId: number): Promise<Post> {
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userUsername: username,
      },
    });

    if (!post) {
      throw new HTTPException(404, { message: "post is not found" });
    }

    return post;
  }

  async getById(user: User, postId: number): Promise<PostResponse> {
    const post = await this.checkPostMustExists(user.username, postId);

    return toPostResponse(post);
  }
}
