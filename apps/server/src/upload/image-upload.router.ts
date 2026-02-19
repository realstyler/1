import { Router, type Router as ExpressRouter } from "express";
import { imageUploadController } from "./image-upload.controller.js";
import { uploadImagesMulter } from "../middlewares/multerMiddleware.js";

const imageUploadRouter: ExpressRouter = Router();

imageUploadRouter.post(
  "/upload",
  uploadImagesMulter.array("images"),
  imageUploadController.uploadImages,
);

imageUploadRouter.get("/signed", imageUploadController.getSignedImageUrls)
imageUploadRouter.delete("/uploaded-tmp", imageUploadController.deleteUploadedTmpImage)

export default imageUploadRouter;
