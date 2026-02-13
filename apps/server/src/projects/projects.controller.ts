import ApiError from "../errors/apiError.js";
import { prisma } from "../lib/prisma/index.js";
import { zodParseOrThrow } from "../utils/zodParseOrThrow.util.js";
import { CreateProjectSchema } from "./projects.schema.js";

class ProjectsController {
  async create(req: any, res: any) {
    const user = req.user;

    const { name, stylePreset } = zodParseOrThrow(
      CreateProjectSchema,
      req.body,
    );

    const project = await prisma.project.create({
      data: {
        name,
        stylePreset,
        user: { connect: user.id },
      },
    });

    res.json(project);
  }

  async share(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new ApiError("Project ID is required", 400);
    const user = req.user;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) throw new ApiError("Project not found", 404);

    if (project.userId !== user.id)
      throw new ApiError("You are not owner of the project", 403);

    await prisma.project.update({
      where: { id },
      data: {
        shareId: crypto.randomUUID(),
      },
    });

    res.status(204).end();
  }

  async getById(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new ApiError("Project ID is required", 400);
    const user = req.user;

    const project = await prisma.project.findUnique({
      where: { id, userId: user.id },
      include: {
        images: true,
      },
    });

    res.json(project);
  }

  async delete(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new ApiError("Project ID is required", 400);
    const user = req.user;

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
      throw new ApiError(
        "Project not found or you are not owner of the project",
        400,
      );

    res.json(project);
  }

  async getByShareId(req: any, res: any) {
    const { shareId } = req.params;
    if (!shareId) throw new ApiError("Project ID is required", 400);

    const project = await prisma.project.findUnique({
      where: { shareId },
      include: {
        images: true,
      },
    });

    res.json(project);
  }
}

export const projectsController = new ProjectsController();
