import {
    BadRequestError
} from "../errors/apiErrors.js";
import { projectsService } from "./projects.service.js";

class ProjectsController {
  async create(req: any, res: any) {
    const user = req.user;
    const project = await projectsService.create(user, req.body);
    res.json(project);
  }

  async share(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Project ID is required");
    const user = req.user;

    await projectsService.share(user, id);
    res.status(204).end();
  }

  async getById(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Project ID is required");
    const user = req.user;

    const project = await projectsService.getById(user, id);
    res.json(project);
  }

  async delete(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Project ID is required");
    const user = req.user;

    const project = await projectsService.delete(user, id);
    res.json(project);
  }

  async getByShareId(req: any, res: any) {
    const { shareId } = req.params;
    if (!shareId) throw new BadRequestError("Project ID is required");

    const project = await projectsService.getByShareId(shareId)
    res.json(project);
  }
}

export const projectsController = new ProjectsController();
