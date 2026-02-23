import type { Request, Response } from "express";
import { imageUploadService } from "./image-upload.service.js";
import { BadRequestError } from "../errors/apiErrors.js";

class ImageUploadController {
  uploadImages = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const tmpIds = req.body.tmpIds;

    const normalizedTmpIds = Array.isArray(tmpIds) ? tmpIds : [tmpIds];

    const result = await imageUploadService.uploadTemporaryImages(
      files,
      normalizedTmpIds,
    );
    res.json(result);
  };

  uploadImagesByUrls = async (req: Request, res: Response) => {
    const urls = req.body.urls as string[];

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      throw new BadRequestError("Urls array is required");
    }

    const result = await imageUploadService.uploadImagesByUrls(urls);

    res.json(result);
  };

  getSignedImageUrls = async (req: Request, res: Response) => {
    const raw = req.query.paths as string;

    if (!raw)
      throw new BadRequestError("Paths is required for generating signed url");

    const normalized = raw.split(",");

    const result = await imageUploadService.createSignedUrls(normalized);
    res.json(result);
  };

  deleteUploadedTmpImage = async (req: any, res: any) => {
    const raw = req.query.paths as string;
    if (!raw) throw new BadRequestError("Paths is required for removing image");
    const paths = raw.split(",");

    paths.forEach((p) => {
      if (!p.startsWith("tmp/"))
        throw new BadRequestError(`The image should be temporary: ${p}`);
    });

    await imageUploadService.deleteImages(paths);
    res.status(204).end();
  };
}

export const imageUploadController = new ImageUploadController();
