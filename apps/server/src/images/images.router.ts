import { Router, type Router as ExpressRouter } from "express";
import { imageUploadController } from "./images.controller.js";
import { uploadImagesMulter } from "../middlewares/multerMiddleware.js";

const imageUploadRouter: ExpressRouter = Router();

imageUploadRouter.post(
  "/upload",
  uploadImagesMulter.array("images"),
  imageUploadController.uploadImages,
);

imageUploadRouter.post(
  "/upload-by-urls",
  imageUploadController.uploadImagesByUrls,
);

imageUploadRouter.get("/signed", imageUploadController.getSignedImageUrls)
imageUploadRouter.get("/download", imageUploadController.downloadImages)
imageUploadRouter.delete("/uploaded-tmp", imageUploadController.deleteUploadedTmpImage)

export default imageUploadRouter;
