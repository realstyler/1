import { ForbiddenError, NotFoundError, BadRequestError } from "../errors/apiErrors.js";
import { prisma } from "../lib/prisma/index.js";
import { imagesService } from "../images/images.service.js";
import type { UserDTO } from "../users/users.dto.js";
import type { 
  CreateCollectionDTO, 
  CollectionDTO, 
  CollectionDetailsDTO, 
  CollectionItemDTO 
} from "./collections.dto.js";
import crypto from "crypto";

class CollectionsService {
  async create(
    user: UserDTO, 
    projectId: string, 
    input: CreateCollectionDTO
  ): Promise<CollectionDTO> {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
    });

    if (!project) throw new NotFoundError("Project not found");

    const collection = await prisma.collection.create({
      data: {
        name: input.name,
        projectId,
        items: {
          create: input.items.map((item) => ({
            originalImageId: item.originalImageId || null,
            styledImageId: item.styledImageId || null,
            orderIndex: item.orderIndex,
          })),
        },
      },
    });

    return {
      id: collection.id,
      projectId: collection.projectId,
      name: collection.name,
      shareId: collection.shareId,
      createdAt: collection.createdAt.toISOString(),
      updatedAt: collection.updatedAt.toISOString(),
    };
  }

  async getAllByProject(
    user: UserDTO, 
    projectId: string
  ): Promise<(CollectionDTO & { itemsCount: number })[]> {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
    });

    if (!project) throw new NotFoundError("Project not found");

    const collections = await prisma.collection.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return collections.map((c) => ({
      id: c.id,
      projectId: c.projectId,
      name: c.name,
      shareId: c.shareId,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      itemsCount: c._count.items,
    }));
  }

  async getById(user: UserDTO, id: string): Promise<CollectionDetailsDTO> {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        project: {
          select: { userId: true, name: true, address: true },
        },
        items: {
          orderBy: { orderIndex: "asc" },
          include: {
            originalImage: true,
            styledImage: true,
          },
        },
      },
    });

    if (!collection) throw new NotFoundError("Collection not found");
    if (collection.project.userId !== user.id) {
      throw new ForbiddenError("You do not have access to this collection");
    }

    return this.loadSignedUrlsForCollection(collection);
  }

  async delete(user: UserDTO, id: string): Promise<{ id: string }> {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    });

    if (!collection) throw new NotFoundError("Collection not found");
    if (collection.project.userId !== user.id) {
      throw new ForbiddenError("You do not have access to this collection");
    }

    await prisma.collection.delete({ where: { id } });
    return { id };
  }

  async share(user: UserDTO, id: string): Promise<{ shareId: string }> {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        project: {
          select: { userId: true },
        },
      },
    });

    if (!collection) throw new NotFoundError("Collection not found");
    if (collection.project.userId !== user.id) {
      throw new ForbiddenError("You do not have access to this collection");
    }

    const shareId = crypto.randomUUID();

    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: { shareId },
      select: { shareId: true },
    });

    return { shareId: updatedCollection.shareId as string };
  }

  async getByShareId(shareId: string): Promise<CollectionDetailsDTO> {
    const collection = await prisma.collection.findUnique({
      where: { shareId },
      include: {
        project: {
          include: {
            user: {
              include: {
                agentProfile: true,
              },
            },
          },
        },
        items: {
          orderBy: { orderIndex: "asc" },
          include: {
            originalImage: true,
            styledImage: true,
          },
        },
      },
    });

    if (!collection) throw new NotFoundError("Collection not found");

    return this.loadSignedUrlsForCollection(collection);
  }

  private async loadSignedUrlsForCollection(collection: any): Promise<CollectionDetailsDTO> {
    let processedItems: CollectionItemDTO[] = [];

    if (collection.items && collection.items.length > 0) {
      const pathsToSign: string[] = [];

      collection.items.forEach((item: any) => {
        if (item.styledImageId && item.styledImage) {
          pathsToSign.push(imagesService.getThumbPath(item.styledImage.restyledPath));
        } else if (item.originalImageId && item.originalImage) {
          pathsToSign.push(imagesService.getThumbPath(item.originalImage.originalPath));
        }
      });

      if (pathsToSign.length > 0) {
        const signedUrls = await imagesService.createSignedUrls(pathsToSign);

        let urlIndex = 0;
        processedItems = collection.items.map((item: any): CollectionItemDTO => {
          let imageUrl: string | null = null;
          let type: "RESTYLED" | "ORIGINAL" | "UNKNOWN" = "UNKNOWN";
          let width: number | null = null;
          let height: number | null = null;

          if (item.styledImageId && item.styledImage) {
            imageUrl = signedUrls[urlIndex] ?? null;
            type = "RESTYLED";
            width = item.styledImage.width || null;
            height = item.styledImage.height || null;
            urlIndex++;
          } else if (item.originalImageId && item.originalImage) {
            imageUrl = signedUrls[urlIndex] ?? null;
            type = "ORIGINAL";
            width = item.originalImage.width || null;
            height = item.originalImage.height || null;
            urlIndex++;
          }

          return {
            id: item.id,
            orderIndex: item.orderIndex,
            type,
            imageUrl,
            width,
            height,
            originalImageId: item.originalImageId || null,
            styledImageId: item.styledImageId || null,
            metadata: item.styledImageId && item.styledImage ? {
              lighting: item.styledImage.lighting || null,
              creativity: item.styledImage.creativity || null,
              aesthetic: item.styledImage.aesthetic || null,
            } : null
          };
        });
      }
    }

    const projectData = collection.project ? {
      id: collection.projectId,
      name: collection.project.name,
      address: collection.project.address || null,
    } : null;

    let agentData = null;
    if (collection.project?.user?.agentProfile) {
      const profile = collection.project.user.agentProfile;
      agentData = {
        companyName: profile.companyName || null,
        contactInfo: profile.contactInfo || null,
        logoUrl: profile.logoUrl || null,
      };
    }

    return {
      id: collection.id,
      name: collection.name,
      shareId: collection.shareId || null,
      createdAt: collection.createdAt.toISOString(),
      project: projectData,
      agentProfile: agentData,
      items: processedItems,
    };
  }
}

export const collectionsService = new CollectionsService();