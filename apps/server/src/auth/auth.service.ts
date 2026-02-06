import ApiError from "../errors/apiError.js";
import { prisma } from "../lib/prisma/index.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";
import type { LoginDTO, RegisterDTO } from "./auth.dto.js";
import { LoginSchema, RegisterSchema } from "./auth.schemas.js";
import bcrypt from "bcrypt";

class AuthService {
  async register(input: RegisterDTO) {
    const data = zodParseOrThrow(RegisterSchema, input);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new ApiError("User already exists", 400);

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
    });

    return user;
  }

  async login(input: LoginDTO) {
    const data = zodParseOrThrow(LoginSchema, input);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new ApiError("Invalid credentials", 400);

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new ApiError("Invalid credentials", 400);

    return user;
  }
}

export const authService = new AuthService();
