import { Hono } from "hono";
import { createUserRoutes } from "../route/user.route";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { User } from "@prisma/client";
import { createPostRoutes } from "../route/post.route";
import { createCommentRoutes } from "../route/comment.route";

export type HonoENV = {
  Variables: {
    user: User;
  };
};

export const app = new Hono();
app.route("/api", createUserRoutes());
app.route("/api", createPostRoutes());
app.route("/api", createCommentRoutes());

app.all("/", (c) => {
  return c.html(
    `<h1>API docs at <a href="https://github.com/Ikhlashmulya/sosmed-api/tree/main/docs">github</a></h1>`,
  );
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        errors: err.message,
      },
      err.status,
    );
  } else if (err instanceof ZodError) {
    return c.json(
      {
        errors: JSON.stringify(err.errors),
      },
      400,
    );
  } else {
    return c.json(
      {
        errors: err.message,
      },
      500,
    );
  }
});

app.notFound((c) => {
  return c.json(
    {
      errors: "endpoint not found",
    },
    404,
  );
});
