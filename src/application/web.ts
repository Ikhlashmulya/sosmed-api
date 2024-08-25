import { Hono } from "hono";
import { createUserRoutes } from "../route/user.route";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

export const web = new Hono();
web.route("/api", createUserRoutes());

web.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({
      errors: err.message
    }, err.status);
  } else if (err instanceof ZodError) {
    return c.json({
      errors: JSON.stringify(err.errors)
    }, 400);
  } else {
    return c.json({
      errors: err.message
    }, 500);
  }
});

web.notFound((c) => {
  return c.json({
    errors: "endpoint not found"
  }, 404)
});
