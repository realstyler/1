import { ForbiddenError, NotFoundError, BadRequestError } from "../errors/apiErrors.js";
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
          if (img.styledImages && img.styledImages.length > 0) {
            img.styledImages.forEach(styled => {
              checks.push(imageUploadService.existImageOrThrow(styled.restyledPath));
            });
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
          originalImages: {
            create: images.map((img) => ({
              originalPath: img.originalPath,
              orderIndex: img.orderIndex,
              styledImages: {
                create: img.styledImages?.map(styled => ({
                  restyledPath: styled.restyledPath,
                  lighting: styled.lighting,
                  creativity: styled.creativity,
                  aesthetic: styled.aesthetic,
                })) || []
              }
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
          originalImages: {
            orderBy: { orderIndex: 'asc' },
            take: 1, 
          },
          _count: {
            select: { originalImages: true }
          }
        }
      }),
      prisma.project.count({ where }),
    ]);

    const projectsWithUrls = await Promise.all(
      projects.map(async (project) => {
        let coverUrl = null;
        const firstImage = project.originalImages[0];
        
        if (firstImage) {
          coverUrl = await imageUploadService.createSignedUrl(firstImage.originalPath);
        }

        const status = project._count.originalImages > 0 ? "Completed" : "Draft";

        return {
          id: project.id,
          name: project.name,
          address: project.address,
          status,
          updatedAt: project.updatedAt,
          coverUrl,
          imagesCount: project._count.originalImages,
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
        originalImages: {
          include: {
            styledImages: true
          }
        },
      },
    });

    if (!project) throw new NotFoundError("Project not found");

    let projectDto: any = project; 

    if (options.loadSignedImages && projectDto.originalImages.length > 0) {
      projectDto.originalImages = await this.loadSignedUrls(projectDto);
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
        originalImages: {
          include: {
            styledImages: true
          }
        },
      },
    });

    if (!project) throw new NotFoundError("Project not found");

    const originalPaths = project.originalImages.map((img) => img.originalPath);
    const restyledPaths = project.originalImages.flatMap((img) => 
      img.styledImages.map(styled => styled.restyledPath)
    );

    await Promise.all([
      ...(originalPaths.length > 0 ? [imageUploadService.deleteImages(originalPaths)] : []),
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
        originalImages: {
          include: {
            styledImages: true
          }
        },
      },
    });

    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  async addImages(user: UserDTO, projectId: string, imagesData: any[]) {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
      include: { originalImages: true },
    });

    if (!project) throw new NotFoundError("Project not found");

    const startingOrderIndex = project.originalImages.length;
    const projectImagesCreateData = [];

    for (let i = 0; i < imagesData.length; i++) {
      const imgData = imagesData[i];
      
      await imageUploadService.existImageOrThrow(imgData.originalPath);
      const originalPath = await imageUploadService.moveImageToProject(imgData.originalPath, projectId);

      const styledImagesCreate = [];
      if (imgData.styledImages && imgData.styledImages.length > 0) {
        for (const styled of imgData.styledImages) {
          await imageUploadService.existImageOrThrow(styled.restyledPath);
          const restyledPath = await imageUploadService.moveImageToProject(styled.restyledPath, projectId);
          styledImagesCreate.push({
            restyledPath,
            lighting: styled.lighting,
            creativity: styled.creativity,
            aesthetic: styled.aesthetic,
          });
        }
      }

      projectImagesCreateData.push({
        originalPath,
        orderIndex: startingOrderIndex + i,
        styledImages: {
          create: styledImagesCreate
        }
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        originalImages: {
          create: projectImagesCreateData,
        },
      },
      include: { 
        originalImages: {
          include: { styledImages: true }
        } 
      },
    });

    return this.loadSignedUrls(updatedProject as any);
  }

  async addStyledImages(user: UserDTO, projectId: string, styledImages: any[]) {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
      include: { originalImages: true },
    });

    if (!project) throw new NotFoundError("Project not found");

    const originalImageIds = project.originalImages.map(img => img.id);

    for (const img of styledImages) {
      if (!originalImageIds.includes(img.originalId)) {
        throw new BadRequestError(`Original image ${img.originalId} does not belong to this project`);
      }
      
      await imageUploadService.existImageOrThrow(img.restyledPath);
      const finalRestyledPath = await imageUploadService.moveImageToProject(img.restyledPath, projectId);

      await prisma.styledProjectImage.create({
        data: {
          originalImageId: img.originalId,
          restyledPath: finalRestyledPath,
          lighting: img.lighting || "NATURAL",
          creativity: img.creativity || "BALANCED",
          aesthetic: img.aesthetic || "MODERN",
        }
      });
    }

    return this.getById(user, projectId, { loadSignedImages: true });
  }

  private async loadSignedUrls(project: any) {
    if (!project.originalImages || project.originalImages.length === 0) return [];

    const originalPaths = project.originalImages.map((i: any) => i.originalPath);
    const restyledPathsToSign = project.originalImages.flatMap((i: any) => 
      i.styledImages.map((styled: any) => styled.restyledPath)
    );

    const [originalUrls, signedRestyledUrls] = await Promise.all([
      imageUploadService.createSignedUrls(originalPaths),
      restyledPathsToSign.length > 0 
        ? imageUploadService.createSignedUrls(restyledPathsToSign) 
        : Promise.resolve([]),
    ]);

    let restyledUrlIndex = 0;

    return project.originalImages.map((img: any, i: number) => {
      const processedStyledImages = img.styledImages.map((styledImg: any) => {
        const signedUrl = signedRestyledUrls[restyledUrlIndex] || null;
        restyledUrlIndex++;
        return {
          ...styledImg,
          restyledUrl: signedUrl
        };
      });

      return {
        ...img,
        originalUrl: originalUrls[i],
        styledImages: processedStyledImages,
      };
    });
  }
}

export const projectsService = new ProjectsService();