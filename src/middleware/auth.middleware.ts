import { User } from "@prisma/client";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";
import { logger } from "../application/winston";

export const authMiddleware = createMiddleware<{ Variables: { user: User } }>(
  async (c, next) => {
    const authorization = c.req.header("authorization") || "";

    if (!authorization) {
      throw new HTTPException(401, { message: "unauthorized token is empty" });
    }

    const bearerToken = authorization.split(" ");

    if (bearerToken[0] !== "Bearer") {
      throw new HTTPException(401, { message: "invalid bearer token" });
    }

    try {
      const decodedToken = await verify(bearerToken[1], "secretKey");
      logger.debug(`sub from token : ${JSON.stringify(decodedToken.sub)}`);
      c.set("user", decodedToken.sub as User);
    } catch (e) {
      throw new HTTPException(401, { message: "token is invalid or expired" });
    }

    await next();
  },
);
