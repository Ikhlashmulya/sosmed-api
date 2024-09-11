import { Hono } from "hono";
import { CommentService } from "../service/comment.service";
import { HonoENV } from "../application/hono";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  CreateCommentRequest,
  DeleteCommentRequest,
  FindCommentByIdRequest,
  FindCommentsByPostIdRequest,
  UpdateCommentRequest,
} from "../model/comment.model";

export const createCommentRoutes = () => {
  const commentService = new CommentService();
  const commentRoutes = new Hono<HonoENV>();

  commentRoutes.get("/posts/:postId/comments", authMiddleware, async (c) => {
    const postId = c.req.param("postId");
    const size = c.req.query("size");
    const page = c.req.query("page");

    const request: FindCommentsByPostIdRequest = {
      postId: Number(postId),
      size: !size ? 10 : Number(size),
      page: !page ? 1 : Number(page),
    };

    const result = await commentService.FindByPostId(request);

    return c.json({
      data: result,
      paging: {
        page: request.page,
        size: request.size,
      },
    });
  });

  commentRoutes.post("/posts/:postId/comments", authMiddleware, async (c) => {
    const user = c.get("user");
    const postId = c.req.param("postId");
    const request = await c.req.json<CreateCommentRequest>();
    request.postId = Number(postId);

    const result = await commentService.create(user, request);

    return c.json({
      data: result,
    });
  });

  commentRoutes.put(
    "/posts/:postId/comments/:commentId",
    authMiddleware,
    async (c) => {
      const user = c.get("user");
      const postId = c.req.param("postId");
      const commentId = c.req.param("commentId");

      const request = await c.req.json<UpdateCommentRequest>();
      request.postId = Number(postId);
      request.commentId = Number(commentId);

      const result = await commentService.update(user, request);

      return c.json({
        data: result,
      });
    },
  );

  commentRoutes.delete(
    "/posts/:postId/comments/:commentId",
    authMiddleware,
    async (c) => {
      const user = c.get("user");
      const postId = c.req.param("postId");
      const commentId = c.req.param("commentId");

      const request: DeleteCommentRequest = {
        commentId: Number(commentId),
        postId: Number(postId),
      };

      const result = await commentService.delete(user, request);

      return c.json({
        data: result,
      });
    },
  );

  commentRoutes.get(
    "/posts/:postId/comments/:commentId",
    authMiddleware,
    async (c) => {
      const postId = c.req.param("postId");
      const commentId = c.req.param("commentId");

      const request: FindCommentByIdRequest = {
        commentId: Number(commentId),
        postId: Number(postId),
      };

      const result = await commentService.FindById(request);

      return c.json({
        data: result,
      });
    },
  );

  return commentRoutes;
};
