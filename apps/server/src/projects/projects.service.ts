import ApiError, {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/apiErrors.js";
import { prisma } from "../lib/prisma/index.js";
import type { UserDTO } from "../user/user.dto.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";
import type { CreateProjectDTO } from "./projects.dto.js";
import { CreateProjectSchema } from "./projects.schema.js";

class ProjectsService {
  async create(user: UserDTO, input: CreateProjectDTO) {
    const { name, stylePreset } = zodParseOrThrow(CreateProjectSchema, input);

    return prisma.project.create({
      data: {
        name,
        stylePreset,
        user: { connect: { id: user.id } },
      },
    });
  }

  async share(user: UserDTO, id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) throw new NotFoundError("Project not found");

    if (project.userId !== user.id)
      throw new ForbiddenError("You are not owner of the project");

    await prisma.project.update({
      where: { id },
      data: {
        shareId: crypto.randomUUID(),
      },
    });
  }

  async getById(user: UserDTO, id: string) {
    return prisma.project.findUnique({
      where: { id, userId: user.id },
      include: {
        images: true,
      },
    });
  }

  async delete(user: UserDTO, id: string) {
    const project = await prisma.project.delete({
      where: {
        id,
        userId: user.id,
      },
      include: {
        images: true,
      },
    });

    if (!project)
      throw new BadRequestError(
        "Project not found or you are not owner of the project",
      );
    return project;
  }

  async getByShareId(shareId: string) {
    return prisma.project.findUnique({
      where: { shareId },
      include: {
        images: true,
      },
    });
  }
}

export const projectsService = new ProjectsService();
