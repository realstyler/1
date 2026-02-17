import {
  LoginSchema,
  RegisterSchema,
  zodParseOrThrow,
  type LoginDTO,
  type RegisterDTO,
} from "shared";
import { BadRequestError } from "../errors/apiErrors.js";
import { prisma } from "../lib/prisma/index.js";
import bcrypt from "bcrypt";

class AuthService {
  async register(input: RegisterDTO) {
    const data = zodParseOrThrow(RegisterSchema, input);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) throw new BadRequestError("User already exists", "email");

    const passwordHash = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
    });
  }

  async login(input: LoginDTO) {
    const data = zodParseOrThrow(LoginSchema, input);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) throw new BadRequestError("Invalid credentials", "email");

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) throw new BadRequestError("Invalid credentials", "password");

    return user;
  }
}

export const authService = new AuthService();
