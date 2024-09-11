import { Hono } from "hono";
import { PostService } from "../service/post.service";
import { authMiddleware } from "../middleware/auth.middleware";
import { HonoENV } from "../application/hono";
import {
  CreatePostRequest,
  FindPostByUsernameRequest,
  GetOrSearchPostsRequest,
  UpdatePostRequest,
} from "../model/post.model";
import { logger } from "../application/winston";

export const createPostRoutes = () => {
  const postRoutes = new Hono<HonoENV>();
  const postService = new PostService();

  postRoutes.post("/posts", authMiddleware, async (c) => {
    const user = c.get("user");

    const request = await c.req.json<CreatePostRequest>();

    logger.debug(`request body : ${JSON.stringify(request)}`);
    logger.debug(`user : ${JSON.stringify(user)}`);

    const result = await postService.create(user, request);

    return c.json({
      data: result,
    });
  });

  postRoutes.put("/posts/:postId", authMiddleware, async (c) => {
    const user = c.get("user");
    const postId = c.req.param("postId");

    const request = await c.req.json<UpdatePostRequest>();
    request.postId = Number(postId);

    const result = await postService.update(user, request);

    return c.json({
      data: result,
    });
  });

  postRoutes.get("/posts/:postId", authMiddleware, async (c) => {
    const postId = Number(c.req.param("postId"));

    const result = await postService.getById(postId);

    return c.json({
      data: result,
    });
  });

  postRoutes.delete("/posts/:postId", authMiddleware, async (c) => {
    const user = c.get("user");
    const postId = Number(c.req.param("postId"));

    const result = await postService.delete(user, postId);

    return c.json({
      data: result,
    });
  });

  postRoutes.get("/posts", authMiddleware, async (c) => {
    const { search, page, size } = c.req.query();

    const request: GetOrSearchPostsRequest = {
      search: search,
      page: !page ? 1 : Number(page),
      size: !size ? 10 : Number(size),
    };

    const result = await postService.getOrSearchPosts(request);

    return c.json({
      data: result,
      paging: {
        page: request.page,
        size: request.size,
      },
    });
  });

  postRoutes.get("/users/:username/posts", authMiddleware, async (c) => {
    const username = c.req.param("username");
    const { size, page } = c.req.query();

    const request: FindPostByUsernameRequest = {
      username: username,
      size: !size ? 10 : Number(size),
      page: !page ? 1 : Number(page),
    };

    const result = await postService.findPostByUsername(request);

    return c.json({
      data: result,
      paging: {
        page: request.page,
        size: request.size,
      },
    });
  });

  return postRoutes;
};
