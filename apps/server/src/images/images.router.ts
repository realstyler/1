import { Router, type Router as ExpressRouter } from "express";
import { imagesController } from "./images.controller.js";
import { uploadImagesMulter } from "../middlewares/multerMiddleware.js";

const imagesRouter: ExpressRouter = Router();

imagesRouter.post(
  "/upload",
  uploadImagesMulter.array("images"),
  imagesController.uploadImages,
);

imagesRouter.post(
  "/upload-by-urls",
  imagesController.uploadImagesByUrls,
);

imagesRouter.get("/signed", imagesController.getSignedImageUrls)
imagesRouter.get("/download", imagesController.downloadImages)
imagesRouter.delete("/uploaded-tmp", imagesController.deleteUploadedTmpImage)

export default imagesRouter;
