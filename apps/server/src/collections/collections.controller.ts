import { BadRequestError } from "../errors/apiErrors.js";
import { collectionsService } from "./collections.service.js";
import { zodParseOrThrow } from "shared";
import { CreateCollectionSchema } from "./collections.schema.js";

class CollectionsController {
  async create(req: any, res: any) {
    const { projectId } = req.params;
    if (!projectId) throw new BadRequestError("Project ID is required");

    const input = zodParseOrThrow(CreateCollectionSchema, req.body);
    const user = req.user;

    const collection = await collectionsService.create(user, projectId, input);
    res.json(collection);
  }

  async getAllByProject(req: any, res: any) {
    const { projectId } = req.params;
    if (!projectId) throw new BadRequestError("Project ID is required");
    
    const user = req.user;
    const collections = await collectionsService.getAllByProject(user, projectId);
    res.json(collections);
  }

  async getById(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Collection ID is required");

    const user = req.user;
    const collection = await collectionsService.getById(user, id);
    res.json(collection);
  }

  async delete(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Collection ID is required");

    const user = req.user;
    const collection = await collectionsService.delete(user, id);
    res.json(collection);
  }

  async share(req: any, res: any) {
    const { id } = req.params;
    if (!id) throw new BadRequestError("Collection ID is required");

    const user = req.user;
    const result = await collectionsService.share(user, id);
    res.json(result);
  }

  async getByShareId(req: any, res: any) {
    const { shareId } = req.params;
    if (!shareId) throw new BadRequestError("Share ID is required");

    const collection = await collectionsService.getByShareId(shareId);
    res.json(collection);
  }
}

export const collectionsController = new CollectionsController();