import { ForbiddenError, NotFoundError } from "../errors/apiErrors.js";
import type { Prisma } from "../lib/prisma/generated/client/index.js";
import { prisma } from "../lib/prisma/index.js";
import { imageUploadService } from "../upload/image-upload.service.js";
import type { UserDTO } from "../user/user.dto.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";
import type { CreateProjectDTO, ProjectDTO } from "./projects.dto.js";
import { CreateProjectSchema } from "./projects.schema.js";

class ProjectsService {
  async create(user: UserDTO, input: CreateProjectDTO) {
    const { name, stylePreset, images } = zodParseOrThrow(
      CreateProjectSchema,
      input,
    );

    if (images)
      await Promise.all(
        images.flatMap((img) => [
          imageUploadService.existImageOrThrow(img.originalPath),
          imageUploadService.existImageOrThrow(img.restyledPath),
        ]),
      );

    return prisma.project.create({
      data: {
        name,
        stylePreset,
        ...(images && {
          images: {
            create: images.map((img) => ({
              originalPath: img.originalPath,
              restyledPath: img.restyledPath,
              orderIndex: img.orderIndex,
            })),
          },
        }),
        user: { connect: { id: user.id } },
      },
    });
  }

  async getAll(
    user: UserDTO,
    params: {
      page: number;
      limit: number;
    },
  ) {
    const where: Prisma.ProjectWhereInput = {
      userId: user.id,
    };

    const [projects, count] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects,
      currentPage: params.page,
      limit: params.limit,
      count: projects.length,
      totalCount: count,
      totalPages: Math.ceil(count / params.limit),
    };
  }

  async getById(
    user: UserDTO,
    id: string,
    options: { loadSignedImages?: boolean } = {},
  ) {
    const project = await prisma.project.findUnique({
      where: { id, userId: user.id },
      include: {
        ...(options.loadSignedImages && { images: true }),
      },
    });

    if (!project) throw new NotFoundError("Project not found");

    if (project.images)
      (project as any).images = await this.loadSignedUrls(project);

    return project;
  }

  async delete(user: UserDTO, id: string) {
    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        images: true,
      },
    });

    if (!project) throw new NotFoundError("Project not found");

    const originalPaths = project.images.map((img) => img.originalPath);
    const restyledPaths = project.images.map((img) => img.restyledPath);

    await Promise.all([
      imageUploadService.deleteImages(originalPaths),
      imageUploadService.deleteImages(restyledPaths),
    ]);

    await prisma.project.delete({ where: { id: project.id } });
    return project;
  }

  async share(user: UserDTO, id: string) {
    const project = await prisma.project.findUnique({
      where: { id, userId: user.id },
    });

    if (!project) throw new NotFoundError("Project not found");

    await prisma.project.update({
      where: { id },
      data: {
        shareId: crypto.randomUUID(),
      },
    });
  }

  async getByShareId(shareId: string) {
    const project = await prisma.project.findUnique({
      where: { shareId },
      include: {
        images: true,
      },
    });

    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  private async loadSignedUrls(project: ProjectDTO) {
    const originalPaths = project.images.map((i) => i.originalPath);
    const restyledPaths = project.images.map((i) => i.restyledPath);

    const [originalUrls, restyledUrls] = await Promise.all([
      imageUploadService.createSignedUrls(originalPaths),
      imageUploadService.createSignedUrls(restyledPaths),
    ]);

    return project.images.map((img, i) => ({
      id: img.id,
      originalUrl: originalUrls[i],
      restyledUrl: restyledUrls[i],
    }));
  }
}

export const projectsService = new ProjectsService();
