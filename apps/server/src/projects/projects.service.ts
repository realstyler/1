import { ForbiddenError, NotFoundError } from "../errors/apiErrors.js";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma/index.js";
import { imageUploadService } from "../upload/image-upload.service.js";
import type { UserDTO } from "../user/user.dto.js";
import type { CreateProjectDTO, ProjectDTO } from "./projects.dto.js";
import { CreateProjectSchema } from "./projects.schema.js";
import { zodParseOrThrow } from "shared";

class ProjectsService {
  async create(user: UserDTO, input: CreateProjectDTO) {
    const { name, address, stylePreset, images } = zodParseOrThrow(
      CreateProjectSchema,
      input,
    );

    if (images && images.length > 0) {
      await Promise.all(
        images.flatMap((img) => {
          const checks = [imageUploadService.existImageOrThrow(img.originalPath)];
          if (img.restyledPath) {
            checks.push(imageUploadService.existImageOrThrow(img.restyledPath));
          }
          return checks;
        }),
      );
    }

    return prisma.project.create({
      data: {
        name,
        address,
        stylePreset: stylePreset ?? null,
        user: { connect: { id: user.id } },
        ...(images && images.length > 0 && {
          images: {
            create: images.map((img) => ({
              originalPath: img.originalPath,
              restyledPath: img.restyledPath ?? null,
              orderIndex: img.orderIndex,
            })),
          },
        }),
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
        orderBy: { updatedAt: 'desc' },
        include: {
          images: {
            orderBy: { orderIndex: 'asc' },
            take: 1, 
          },
          _count: {
            select: { images: true }
          }
        }
      }),
      prisma.project.count({ where }),
    ]);

    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        let coverUrl = null;
        const firstImage = project.images[0];
        
        if (firstImage) {
          coverUrl = await imageUploadService.createSignedUrl(firstImage.originalPath);
        }

        const status = project._count.images > 0 ? "Completed" : "Draft";

        return {
          id: project.id,
          name: project.name,
          address: project.address,
          status,
          updatedAt: project.updatedAt,
          coverUrl,
          imagesCount: project._count.images,
        };
      })
    );

    return {
      projects: projectsWithUrls,
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
        images: true,
      },
    });

    if (!project) throw new NotFoundError("Project not found");

    const projectDto: ProjectDTO = project;

    if (options.loadSignedImages && projectDto.images.length > 0) {
      projectDto.images = await this.loadSignedUrls(projectDto);
    }

    return projectDto;
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
    const restyledPaths = project.images
      .map((img) => img.restyledPath)
      .filter((path): path is string => path !== null);

    await Promise.all([
      imageUploadService.deleteImages(originalPaths),
      ...(restyledPaths.length > 0 ? [imageUploadService.deleteImages(restyledPaths)] : []),
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

  async addImages(user: UserDTO, projectId: string, tmpPaths: string[]) {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
      include: { images: true },
    });

    if (!project) throw new NotFoundError("Project not found");

    const startingOrderIndex = project.images.length;
    const projectImagesData = [];

    for (let i = 0; i < tmpPaths.length; i++) {
      const tmpPath = tmpPaths[i];
      
      await imageUploadService.existImageOrThrow(tmpPath as string);
      const originalPath = await imageUploadService.moveImageToProject(tmpPath as string, projectId);

      projectImagesData.push({
        originalPath,
        restyledPath: null, 
        orderIndex: startingOrderIndex + i,
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        images: {
          create: projectImagesData,
        },
      },
      include: { images: true },
    });

    return this.loadSignedUrls(updatedProject as unknown as ProjectDTO);
  }

  private async loadSignedUrls(project: ProjectDTO) {
    if (!project.images || project.images.length === 0) return [];

    const originalPaths = project.images.map((i) => i.originalPath);
    const restyledPathsToSign = project.images
      .map((i) => i.restyledPath)
      .filter((path): path is string => path !== null);

    const [originalUrls, signedRestyledUrls] = await Promise.all([
      imageUploadService.createSignedUrls(originalPaths),
      restyledPathsToSign.length > 0 
        ? imageUploadService.createSignedUrls(restyledPathsToSign) 
        : Promise.resolve([]),
    ]);

    let restyledUrlIndex = 0;

    return project.images.map((img, i) => {
      let currentRestyledUrl: string | null = null;
      
      if (img.restyledPath !== null) {
        currentRestyledUrl = signedRestyledUrls[restyledUrlIndex] || null;
        restyledUrlIndex++;
      }

      return {
        ...img,
        originalUrl: originalUrls[i],
        restyledUrl: currentRestyledUrl,
      };
    });
  }
}

export const projectsService = new ProjectsService();