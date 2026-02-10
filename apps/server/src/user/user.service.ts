import { prisma } from "../lib/prisma/index.js";

class UserService {
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        stripeCustomerId: true,
        createdAt: true,
      },
    });
  }
}

export const userService = new UserService();
