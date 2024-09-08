import { Hono } from "hono";
import { UserService } from "../service/user.service";
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
} from "../model/user.model";
import { User } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.middleware";

export const createUserRoutes = () => {
  const userService = new UserService();

  const userRoutes = new Hono<{ Variables: { user: User } }>();
  userRoutes.post("/users", async (c) => {
    const request = await c.req.json<RegisterUserRequest>();

    const result = await userService.register(request);

    return c.json({
      data: result,
    });
  });

  userRoutes.post("/users/_login", async (c) => {
    const request = await c.req.json<LoginUserRequest>();

    const result = await userService.login(request);

    return c.json({
      data: result,
    });
  });

  userRoutes.patch("/users/_current", authMiddleware, async (c) => {
    const user = c.get("user");

    const request = await c.req.json<UpdateUserRequest>();

    const result = await userService.update(user, request);

    return c.json({
      data: result,
    });
  });

  userRoutes.get("/users/_current", authMiddleware, async (c) => {
    const user = c.get("user");
    const result = userService.get(user);

    return c.json({
      data: result,
    });
  });

  userRoutes.get("/users/:username", authMiddleware, async (c) => {
    const username = c.req.param("username");
    const result = await userService.getByUsername(username);

    return c.json({
      data: result,
    });
  });

  return userRoutes;
};
