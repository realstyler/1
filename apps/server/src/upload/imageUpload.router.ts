import { Router, type Router as ExpressRouter } from "express";
import { imageUploadController } from "./imageUpload.controller.js";
import { uploadImagesMulter } from "../middlewares/multerMiddleware.js";

const imageUploadRouter: ExpressRouter = Router();

imageUploadRouter.post(
  "/upload",
  uploadImagesMulter.array("images"),
  imageUploadController.uploadImages,
);

export default imageUploadRouter;
