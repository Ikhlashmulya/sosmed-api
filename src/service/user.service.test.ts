import { describe } from "@jest/globals";
import { PrismaClient, User } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { beforeEach, it } from "node:test";
import { Validation } from "../validation/validation";
import { UserService } from "./user.service";
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest } from "../model/user.model";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { hashSync } from "bcrypt";

describe("test user service", () => {
  let prismaMock: DeepMockProxy<PrismaClient>;
  let validation: Validation;
  let userService: UserService;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    validation = new Validation();
    userService = new UserService(prismaMock, validation);
  });

  it("should successfully register a new user", async () => {
    prismaMock.user.count.mockResolvedValue(0);

    const registerRequest: RegisterUserRequest = {
      name: "john doe",
      username: "johndoe",
      password: "johndoe123"
    }

    prismaMock.user.create.mockResolvedValue({
      username: registerRequest.username,
      password: registerRequest.password,
      name: registerRequest.name
    });

    const result = await userService.register(registerRequest);

    expect(result.name).toBe(registerRequest.name);
    expect(result.username).toBe(registerRequest.username);
    expect(result.token).toBeUndefined();
    expect(prismaMock.user.count).toHaveBeenCalledWith({ where: { username: registerRequest.username } });
  });

  it("should fail to register with existing username", async () => {
    prismaMock.user.count.mockResolvedValue(1);

    const registerRequest: RegisterUserRequest = {
      name: "john doe",
      username: "johndoe",
      password: "johndoe123"
    }

    await expect(() => userService.register(registerRequest)).rejects.toThrow(HTTPException);
  });

  it("should throw a validation error for missing required fields", async () => {
    const registerRequest: RegisterUserRequest = {
      name: "",
      username: "",
      password: ""
    }

    await expect(() => userService.register(registerRequest)).rejects.toThrow(ZodError);

  });

  it("should successfully login", async () => {
    const loginRequest: LoginUserRequest = {
      username: "johndoe",
      password: "johndoe123"
    }

    prismaMock.user.findFirst.mockResolvedValue({
      username: loginRequest.username,
      password: hashSync(loginRequest.password, 10),
      name: "John Doe"
    });

    const result = await userService.login(loginRequest);
    expect(result.name).toBe("John Doe");
    expect(result.username).toBe(loginRequest.username);
    expect(result.token).toBeDefined();
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { username: loginRequest.username } });

  });

  it("should fail for invalid username", async () => {
    const loginRequest: LoginUserRequest = {
      username: "johndoe",
      password: "johndoe123"
    }

    prismaMock.user.findFirst.mockResolvedValue(null);

    expect(() => userService.login(loginRequest)).rejects.toThrow(HTTPException);
  });

  it("should fail for invalid password", async () => {
    const loginRequest: LoginUserRequest = {
      username: "johndoe",
      password: "wrongpassword"
    }

    prismaMock.user.findFirst.mockResolvedValue({
      username: loginRequest.username,
      password: hashSync("password", 10),
      name: "John Doe"
    });

    expect(() => userService.login(loginRequest)).rejects.toThrow(HTTPException);
  });

  it("should throw validation error for missing required fields", async () => {
    const loginRequest: LoginUserRequest = {
      username: "",
      password: ""
    }

    expect(() => userService.login(loginRequest)).rejects.toThrow(ZodError);
  });


  it("should successfully update user", async () => {
    const updateRequest: UpdateUserRequest = {
      name: "John Doe updated"
    }

    prismaMock.user.update.mockResolvedValue({ username: "johndoe", password: "password", name: updateRequest.name } as User);

    const result = await userService.update({ name: "John Doe", username: "johndoe", password: "password" }, updateRequest);

    expect(result.name).toBe(updateRequest.name);
  });

  it("should successfully find user with username", async () => {
    const user: User = {
      username: "test",
      password: "test",
      name: "test"
    }

    prismaMock.user.findFirst.mockResolvedValue(user);

    const result = await userService.getByUsername("test");
    expect(result.name).toBe("test");
    expect(result.username).toBe("test");
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { username: "test" } });
  });

  it("should fail find user", async () => {
    prismaMock.user.findFirst.mockResolvedValue(null);

    expect(() => userService.getByUsername("test")).rejects.toThrow(HTTPException);
  });
});





















