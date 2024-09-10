import { Hono } from "hono";
import { UserService } from "../service/user.service";
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
} from "../model/user.model";
import { authMiddleware } from "../middleware/auth.middleware";
import { HonoENV } from "../application/hono";
import { PostService } from "../service/post.service";
import { FindPostByUsernameRequest } from "../model/post.model";
import { logger } from "../application/winston";

export const createUserRoutes = (
  userService: UserService,
  postService: PostService,
) => {
  const userRoutes = new Hono<HonoENV>();
  userRoutes.post("/", async (c) => {
    const request = await c.req.json<RegisterUserRequest>();

    const result = await userService.register(request);

    return c.json({
      data: result,
    });
  });

  userRoutes.post("/_login", async (c) => {
    const request = await c.req.json<LoginUserRequest>();

    const result = await userService.login(request);

    return c.json({
      data: result,
    });
  });

  userRoutes.patch("/_current", authMiddleware, async (c) => {
    const user = c.get("user");

    const request = await c.req.json<UpdateUserRequest>();

    const result = await userService.update(user, request);

    return c.json({
      data: result,
    });
  });

  userRoutes.get("/_current", authMiddleware, async (c) => {
    const user = c.get("user");
    const result = userService.get(user);

    return c.json({
      data: result,
    });
  });

  userRoutes.get("/:username", authMiddleware, async (c) => {
    const username = c.req.param("username");
    const result = await userService.getByUsername(username);

    return c.json({
      data: result,
    });
  });

  userRoutes.get("/:username/posts", authMiddleware, async (c) => {
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

  return userRoutes;
};
