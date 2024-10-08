import { Validation } from "../validation/validation";
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  toUserResponse,
  UserResponse,
} from "../model/user.model";
import { UserValidation } from "../validation/user.validation";
import { User } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import { compare, hash } from "bcrypt";
import { sign } from "hono/jwt";
import { prisma } from "../application/prisma";
import { Config } from "../application/config";

export class UserService {
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    const registerRequest = Validation.validate(
      UserValidation.REGISTER,
      request,
    );

    const totalUserWithSameUsername = await prisma.user.count({
      where: { username: registerRequest.username },
    });
    if (totalUserWithSameUsername > 0) {
      throw new HTTPException(400, { message: "username already exist" });
    }

    registerRequest.password = await hash(registerRequest.password, 10);

    const user = await prisma.user.create({
      data: registerRequest,
    });

    return toUserResponse(user);
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginRequest = Validation.validate(UserValidation.LOGIN, request);

    const user = await prisma.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HTTPException(401, {
        message: "username or password is wrong",
      });
    }

    const isPasswordValid = await compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: "username or password is wrong",
      });
    }

    const userResponse = toUserResponse(user);

    userResponse.token = await sign(
      { exp: Math.floor(Date.now() / 1000) + 60 * 5, sub: user },
      Config.get("JWT_SECRET"),
    );

    return userResponse;
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    const updateRequest = Validation.validate(UserValidation.UPDATE, request);

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await hash(updateRequest.password, 10);
    }

    const result = await prisma.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return toUserResponse(result);
  }

  get(user: User): UserResponse {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async getByUsername(username: string): Promise<UserResponse> {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: "user not found" });
    }

    return toUserResponse(user);
  }
}
