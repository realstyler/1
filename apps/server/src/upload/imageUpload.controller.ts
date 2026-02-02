import type { Request, Response } from "express";
import { imageUploadService } from "./imageUpload.service.js";

class ImageUploadController {
  uploadImages = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const result = await imageUploadService.uploadImages(files);
    res.json(result);
  };
}

export const imageUploadController = new ImageUploadController();
