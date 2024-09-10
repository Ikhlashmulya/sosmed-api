import { Hono } from "hono";
import { PostService } from "../service/post.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { HonoENV } from "../application/hono";
import { CreatePostRequest, UpdatePostRequest } from "../model/post.model";
import { logger } from "../application/winston";

export const createPostRoutes = (postService: PostService) => {
  const postRoutes = new Hono<HonoENV>();

  postRoutes.post("/", authMiddleware, async (c) => {
    const user = c.get("user");

    const request = await c.req.json<CreatePostRequest>();

    logger.debug(`request body : ${JSON.stringify(request)}`);
    logger.debug(`user : ${JSON.stringify(user)}`);

    const result = await postService.create(user, request);

    return c.json({
      data: result,
    });
  });

  postRoutes.put("/:postId", authMiddleware, async (c) => {
    const user = c.get("user");
    const postId = c.req.param("postId");

    const request = await c.req.json<UpdatePostRequest>();
    request.postId = Number(postId);

    const result = await postService.update(user, request);

    return c.json({
      data: result,
    });
  });

  postRoutes.get("/:postId", authMiddleware, async (c) => {
    const postId = Number(c.req.param("postId"));

    const result = await postService.getById(postId);

    return c.json({
      data: result,
    });
  });

  postRoutes.delete("/:postId", authMiddleware, async (c) => {
    const user = c.get("user");
    const postId = Number(c.req.param("postId"));

    const result = await postService.delete(user, postId);

    return c.json({
      data: result,
    });
  });

  return postRoutes;
};
