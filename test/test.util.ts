import { hash } from "bcrypt";
import { sign } from "hono/jwt";
import { prisma } from "../src/application/prisma";
import { Post } from "@prisma/client";

export class UserTest {
  static async delete() {
    await prisma.user.deleteMany({
      where: {
        username: "test",
      },
    });
  }

  static async create() {
    await prisma.user.create({
      data: {
        username: "test",
        password: await hash("password", 10),
        name: "test",
      },
    });
  }

  static async getToken(): Promise<string> {
    const user = await prisma.user.findFirst({ where: { username: "test" } });
    if (!user) {
      throw new Error("user tidak ada");
    }
    return await sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 5, sub: user },
      "secretKey",
    );
  }
}

export class PostTest {
  static async deleteAll() {
    await prisma.post.deleteMany({});
  }

  static async create(): Promise<Post> {
    return await prisma.post.create({
      data: {
        content: "test content",
        title: "test title",
        userUsername: "test",
      },
    });
  }

  static async createManyPost() {
    await prisma.post.createMany({
      data: [
        {
          content: "test 1",
          title: "test 1",
          userUsername: "test",
        },
        {
          content: "test 2",
          title: "test 2",
          userUsername: "test",
        },
        {
          content: "test 3",
          title: "test 3",
          userUsername: "test",
        },
        {
          content: "isi content nya apa aja",
          title: "apa aja",
          userUsername: "test",
        },
      ],
    });
  }
}
