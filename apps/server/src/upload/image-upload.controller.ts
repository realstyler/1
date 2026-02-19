import type { Request, Response } from "express";
import { imageUploadService } from "./image-upload.service.js";
import { BadRequestError } from "../errors/apiErrors.js";

class ImageUploadController {
  uploadImages = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const tmpIds = req.body.tmpIds; // string | string[]

    const normalizedTmpIds = Array.isArray(tmpIds) ? tmpIds : [tmpIds];

    const result = await imageUploadService.uploadTemporaryImages(
      files,
      normalizedTmpIds,
    );
    res.json(result);
  };

  getSignedImageUrls = async (req: Request, res: Response) => {
    const raw = req.query.paths as string;

    if (!raw)
      throw new BadRequestError("Paths is required for generating signed url");

    const normalized = raw.split("&&&");

    const result = await imageUploadService.createSignedUrls(normalized);
    res.json(result);
  };

  deleteUploadedTmpImage = async (req: any, res: any) => {
    const path = req.query.path as string;
    if (!path) throw new BadRequestError("Path is required for removing image");
    if (!path.startsWith("tmp/"))
      throw new BadRequestError("The image should be temporary");

    await imageUploadService.deleteImages([path]);
    res.status(204).end();
  };
}

export const imageUploadController = new ImageUploadController();
