import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { CommentTest, PostTest, UserTest } from "./test.util";
import { app } from "../src/application/hono";

describe("POST /api/posts/:postId/comments", () => {
  beforeEach(async () => {
    await UserTest.create();
  });
  afterEach(async () => {
    await CommentTest.deleteAll();
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully create a new comment", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "test comment",
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(200);
    expect(responseBody.data.content).toBe("test comment");
    expect(responseBody.data.username).toBe("test");
    expect(responseBody.data.createdAt).toBeDefined();
    expect(responseBody.data.updatedAt).toBeDefined();
  });

  it("should fail in validation", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}/comments`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "",
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(400);
    expect(responseBody.errors).toBeDefined();
  });

  it("should fail cause post not found", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/posts/123456/comments`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "test",
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(404);
    expect(responseBody.errors).toBe("post is not found");
  });
});

describe("PUT /api/posts/:postId/comments/:commentId", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await CommentTest.deleteAll();
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully update a comment", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();
    const comment = await CommentTest.create(post.id);

    const result = await app.request(
      `/api/posts/${post.id}/comments/${comment.id}`,
      {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "Application/Json",
          Authorization: `Bearer ${token}`,
        }),
        body: JSON.stringify({
          content: "test edit comment",
        }),
      },
    );

    const responseBody = await result.json();

    expect(result.status).toBe(200);
    expect(responseBody.data.content).not.toBe(post.content);
    expect(responseBody.data.content).toBe("test edit comment");
    expect(responseBody.data.username).toBe("test");
    expect(responseBody.data.createdAt).toBeDefined();
    expect(responseBody.data.updatedAt).toBeDefined();
  });

  it("should fail in validation", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();
    const comment = await CommentTest.create(post.id);

    const result = await app.request(
      `/api/posts/${post.id}/comments/${comment.id}`,
      {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "Application/Json",
          Authorization: `Bearer ${token}`,
        }),
        body: JSON.stringify({
          content: "",
        }),
      },
    );

    const responseBody = await result.json();

    expect(result.status).toBe(400);
    expect(responseBody.errors).toBeDefined();
  });

  it("should fail cause comment not found", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/posts/123456/comments/9999999`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "test",
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(404);
    expect(responseBody.errors).toBe("comment is not found");
  });
});

describe("DELETE /api/posts/:postId/comments/:commentId", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await CommentTest.deleteAll();
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully delete a comment", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();
    const comment = await CommentTest.create(post.id);

    const result = await app.request(
      `/api/posts/${post.id}/comments/${comment.id}`,
      {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "Application/Json",
          Authorization: `Bearer ${token}`,
        }),
      },
    );

    const responseBody = await result.json();
    console.log(responseBody);

    expect(result.status).toBe(200);
    expect(responseBody.data).toBe(true);
  });

  it("should fail cause comment not found", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}/comments/9999999`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "test",
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(404);
    expect(responseBody.errors).toBe("comment is not found");
  });
});

describe("GET /api/posts/:postId/comments/:commentId", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await CommentTest.deleteAll();
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully get a comment", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();
    const comment = await CommentTest.create(post.id);

    const result = await app.request(
      `/api/posts/${post.id}/comments/${comment.id}`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "Application/Json",
          Authorization: `Bearer ${token}`,
        }),
      },
    );

    const responseBody = await result.json();

    expect(result.status).toBe(200);
    expect(responseBody.data.content).toBe(comment.content);
    expect(responseBody.data.createdAt).toBeDefined();
    expect(responseBody.data.updatedAt).toBeDefined();
  });

  it("should fail cause comment not found", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();

    const result = await app.request(`/api/posts/${post.id}/comments/9999999`, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
      body: JSON.stringify({
        content: "test",
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(404);
    expect(responseBody.errors).toBe("comment is not found");
  });
});

describe("GET /api/posts/:postId/comments", () => {
  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await CommentTest.deleteAll();
    await PostTest.deleteAll();
    await UserTest.delete();
  });

  it("should successfully get a comment by post id", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();
    await CommentTest.createMany(post.id);

    const result = await app.request(`/api/posts/${post.id}/comments`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(200);
    expect(responseBody.data).toHaveLength(5);
    expect(responseBody.paging.size).toBe(10);
    expect(responseBody.paging.page).toBe(1);
  });

  it("should successfully get a comment by post id with paging", async () => {
    const token = await UserTest.getToken();
    const post = await PostTest.create();
    await CommentTest.createMany(post.id);

    const result = await app.request(
      `/api/posts/${post.id}/comments?page=1&size=3`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "Application/Json",
          Authorization: `Bearer ${token}`,
        }),
      },
    );

    const responseBody = await result.json();

    expect(result.status).toBe(200);
    expect(responseBody.data).toHaveLength(3);
    expect(responseBody.paging.size).toBe(3);
    expect(responseBody.paging.page).toBe(1);
  });

  it("should fail get a comment by post id cause post is not found", async () => {
    const token = await UserTest.getToken();

    const result = await app.request(`/api/posts/999999/comments`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "Application/Json",
        Authorization: `Bearer ${token}`,
      }),
    });

    const responseBody = await result.json();

    expect(result.status).toBe(404);
    expect(responseBody.errors).toBe("post is not found");
  });
});
