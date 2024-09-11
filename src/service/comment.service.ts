import { Comment, User } from "@prisma/client";
import {
  CommentResponse,
  CreateCommentRequest,
  DeleteCommentRequest,
  FindCommentByIdRequest,
  FindCommentsByPostIdRequest,
  toCommentResponse,
  UpdateCommentRequest,
} from "../model/comment.model";
import { Validation } from "../validation/validation";
import { CommentValidation } from "../validation/comment.validation";
import { prisma } from "../application/prisma";
import { HTTPException } from "hono/http-exception";
import { logger } from "../application/winston";
import { argv0 } from "process";
import { throws } from "assert";

export class CommentService {
  async create(
    user: User,
    request: CreateCommentRequest,
  ): Promise<CommentResponse> {
    const createRequest = Validation.validate(
      CommentValidation.CREATE,
      request,
    );

    logger.debug(`request create comment : ${JSON.stringify(createRequest)}`);

    const countPost = await prisma.post.count({
      where: {
        id: createRequest.postId,
      },
    });

    if (countPost == 0) {
      throw new HTTPException(404, { message: "post is not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content: createRequest.content,
        postId: createRequest.postId,
        userUsername: user.username,
      },
    });

    return toCommentResponse(comment);
  }

  async update(
    user: User,
    request: UpdateCommentRequest,
  ): Promise<CommentResponse> {
    const { content, commentId, postId } = Validation.validate(
      CommentValidation.UPDATE,
      request,
    );

    let comment = await this.checkCommentMustExists(postId, commentId);

    comment = await prisma.comment.update({
      data: {
        content: content,
      },
      where: {
        id: commentId,
        userUsername: user.username,
      },
    });

    return toCommentResponse(comment);
  }

  async delete(user: User, request: DeleteCommentRequest): Promise<boolean> {
    const { commentId, postId } = Validation.validate(
      CommentValidation.DELETE,
      request,
    );

    let comment = await this.checkCommentMustExists(postId, commentId);

    await prisma.comment.delete({
      where: {
        id: commentId,
        userUsername: user.username,
      },
    });

    return true;
  }

  async FindById(request: FindCommentByIdRequest): Promise<CommentResponse> {
    const { commentId, postId } = Validation.validate(
      CommentValidation.FIND,
      request,
    );

    const comment = await this.checkCommentMustExists(postId, commentId);

    return toCommentResponse(comment);
  }

  async FindByPostId(
    request: FindCommentsByPostIdRequest,
  ): Promise<CommentResponse[]> {
    const { postId } = Validation.validate(
      CommentValidation.FIND_BY_POST_ID,
      request,
    );

    const countPost = await prisma.post.count({
      where: {
        id: postId,
      },
    });

    if (countPost == 0) {
      throw new HTTPException(404, { message: "post is not found" });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      take: request.size,
      skip: (request.page - 1) * request.size,
    });

    return comments.map((comment) => toCommentResponse(comment));
  }

  async checkCommentMustExists(
    postId: number,
    commentId: number,
  ): Promise<Comment> {
    const comment = await prisma.comment.findUnique({
      where: {
        postId: postId,
        id: commentId,
      },
    });

    if (!comment) {
      throw new HTTPException(404, { message: "comment is not found" });
    }

    return comment;
  }
}
