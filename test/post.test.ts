import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { PostTest, UserTest } from "./test.util";
import { app } from "../src/application/hono";
import { logger } from "../src/application/winston";

describe("POST /api/posts", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully create a new post", async () => {
    const token = await UserTest.getToken();
    const result = await app.request("/api/posts", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "test isi content",
        title: "test judul",
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();

    expect(responseBody.data.title).toBe("test judul");
    expect(responseBody.data.content).toBe("test isi content");
    expect(responseBody.data.createdAt).toBeDefined();
    expect(responseBody.data.updatedAt).toBeDefined();

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });

  it("should fail in validation", async () => {
    const token = await UserTest.getToken();
    const result = await app.request("/api/posts", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "",
        title: "",
      }),
    });

    expect(result.status).toBe(400);

    const responseBody = await result.json();

    expect(responseBody.errors).toBeDefined();
    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });
});

describe("PUT /api/posts/:postId", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully update a post", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "test edit content",
        title: "test edit judul",
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();

    expect(responseBody.data.title).toBe("test edit judul");
    expect(responseBody.data.title).not.toBe(post.title);
    expect(responseBody.data.content).toBe("test edit content");
    expect(responseBody.data.content).not.toBe(post.content);
    expect(responseBody.data.createdAt).toBeDefined();
    expect(responseBody.data.updatedAt).toBeDefined();

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });

  it("should fail in validation", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "",
        title: "",
      }),
    });

    expect(result.status).toBe(400);

    const responseBody = await result.json();
    expect(responseBody.errors).toBeDefined();

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });
});

describe("GET /api/posts/:postId", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully get a post", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();

    expect(responseBody.data.title).toBe(post.title);
    expect(responseBody.data.content).toBe(post.content);
    expect(responseBody.data.createdAt).toBeDefined();
    expect(responseBody.data.updatedAt).toBeDefined();

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });

  it("should fail post not found", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/posts/102131314`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(404);

    const responseBody = await result.json();
    expect(responseBody.errors).toBeDefined();

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });
});

describe("DELETE /api/posts/:postId", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully delete a post", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();

    expect(responseBody.data).toBe(true);

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });

  it("should fail post not found", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/posts/102131314`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(404);

    const responseBody = await result.json();
    expect(responseBody.errors).toBeDefined();

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });
});

describe("GET /api/users/:username/posts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await PostTest.createManyPost();
  });

  afterEach(async () => {
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully find posts by username", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/users/test/posts`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();
    expect(responseBody.data).toBeDefined();
    expect(responseBody.paging.size).toBe(10);
    expect(responseBody.paging.page).toBe(1);

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });

  it("should successfully find posts by username with paging query params", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/users/test/posts?size=5&page=1`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();
    expect(responseBody.data).toBeDefined();
    expect(responseBody.paging.size).toBe(5);
    expect(responseBody.paging.page).toBe(1);

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });

  it("should fail user not found", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/users/wrongusername/posts`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(404);

    const responseBody = await result.json();
    expect(responseBody.errors).toBeDefined();

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });
});

describe("GET /api/posts", () => {
  beforeEach(async () => {
    await UserTest.create();
    await PostTest.createManyPost();
  });

  afterEach(async () => {
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully get posts", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/posts`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();
    expect(responseBody.data).toBeDefined();
    expect(responseBody.paging.size).toBe(10);
    expect(responseBody.paging.page).toBe(1);

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });

  it("should successfully search posts", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/posts?search=apa`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();
    expect(responseBody.data).toHaveLength(1);
    expect(responseBody.paging.size).toBe(10);
    expect(responseBody.paging.page).toBe(1);

    logger.debug(`result json : ${JSON.stringify(responseBody)}`);
  });
});
