import { beforeEach, afterEach, describe, expect, it } from "@jest/globals";
import { web } from "../src/application/web";
import { UserTest } from "./test.util";

describe("POST /api/users", () => {

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should successfully register a new user", async () => {
    const result = await web.request("/api/users", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "test",
        password: "testing123",
        name: "test"
      })
    });

    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({
      data: {
        username: "test",
        name: "test"
      }
    });
  });

  it("should fail in validation cause password less than 8 character", async () => {
    const result = await web.request("/api/users", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "test",
        password: "test123",
        name: "test"
      })
    });

    const responseBody = await result.json();

    expect(result.status).toBe(400);
    expect(responseBody.errors).toBeDefined();

  });


  it("should fail in validation cause missing required fields", async () => {
    const result = await web.request("/api/users", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "",
        password: "",
        name: ""
      })
    });

    const responseBody = await result.json();

    expect(result.status).toBe(400);
    expect(responseBody.errors).toBeDefined();

  });

  it("should fail register with existing username", async () => {
    await UserTest.create();

    const result = await web.request("/api/users", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "test",
        password: "testing123",
        name: "test"
      })
    });

    const responseBody = await result.json();

    expect(result.status).toBe(400);
    expect(responseBody.errors).toBe("username already exist");

  });
});


describe("POST /api/users/login", () => {

  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should successfully login", async () => {
    const result = await web.request("/api/users/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "test",
        password: "password",
      })
    });

    const responseBody = await result.json();
    expect(result.status).toBe(200);
    expect(responseBody.data.username).toBe("test");
    expect(responseBody.data.name).toBe("test");
    expect(responseBody.data.token).toBeDefined();

  });

  it("should fail login with wrong username", async () => {
    const result = await web.request("/api/users/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "wrongusername",
        password: "password",
      })
    });

    const responseBody = await result.json();

    expect(result.status).toBe(401);
    expect(responseBody.errors).toBe("username or password is wrong");

  });

  it("should fail login with wrong password", async () => {
    const result = await web.request("/api/users/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "test",
        password: "wrongpassword",
      })
    });

    const responseBody = await result.json();

    expect(result.status).toBe(401);
    expect(responseBody.errors).toBe("username or password is wrong");

  });

  it("should fail in validation for missing required fields", async () => {
    const result = await web.request("/api/users/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "",
        password: "",
      })
    });

    const responseBody = await result.json();

    expect(result.status).toBe(400);
    expect(responseBody.errors).toBeDefined();
  });

});

describe("GET /api/users/current", () => {

  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should successfully get current user", async () => {
    const token = await UserTest.getToken();

    const result = await web.request("/api/users/current", {
      method: "GET",
      headers: new Headers({ "Content-Type": "Application/Json", "Authorization": `Bearer ${token}` }),
    });

    const responseBody = await result.json();
    expect(result.status).toBe(200);
    expect(responseBody.data.username).toBe("test");
    expect(responseBody.data.name).toBe("test");
  });

  it("should fail get current user cause token is empty", async () => {
    const result = await web.request("/api/users/current", {
      method: "GET",
      headers: new Headers({ "Content-Type": "Application/Json" }),
    });

    const responseBody = await result.json();
    expect(result.status).toBe(401);
    expect(responseBody.errors).toBe("unauthorized token is empty");
  });

  it("should fail get current user cause Authorization not Bearer token", async () => {
    const result = await web.request("/api/users/current", {
      method: "GET",
      headers: new Headers({ "Content-Type": "Application/Json", "Authorization": "not bearerToken" }),
    });

    const responseBody = await result.json();
    expect(result.status).toBe(401);
    expect(responseBody.errors).toBe("invalid bearer token");
  });

  it("should fail get current user cause token is invalid", async () => {
    const result = await web.request("/api/users/current", {
      method: "GET",
      headers: new Headers({ "Content-Type": "Application/Json", "Authorization": "Bearer invalidToken" }),
    });

    const responseBody = await result.json();
    expect(result.status).toBe(401);
    expect(responseBody.errors).toBe("token is invalid or expired");
  });
});

describe("PATCH /api/users/current", () => {

  beforeEach(async () => {
    await UserTest.create();
  });

  afterEach(async () => {
    await UserTest.delete();
  });

  it("should successfully updated user name", async () => {
    const token = await UserTest.getToken();

    const result = await web.request("/api/users/current", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "Application/Json", "Authorization": `Bearer ${token}` }),
      body: JSON.stringify({
        name: "test-updated"
      })
    });

    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({
      data: {
        username: "test",
        name: "test-updated"
      }
    });

  });

  it("should successfully updated user pasword", async () => {
    const token = await UserTest.getToken();

    let result = await web.request("/api/users/current", {
      method: "PATCH",
      headers: new Headers({ "Content-Type": "Application/Json", "Authorization": `Bearer ${token}` }),
      body: JSON.stringify({
        password: "new password"
      })
    });

    expect(result.status).toBe(200);

    result = await web.request("/api/users/login", {
      method: "POST",
      headers: new Headers({ "Content-Type": "Application/Json" }),
      body: JSON.stringify({
        username: "test",
        password: "new password",
      })
    });

    expect(result.status).toBe(200);

    const responseBody = await result.json();
    expect(responseBody.data.name).toBe("test");
    expect(responseBody.data.token).toBeDefined();

  });
});
