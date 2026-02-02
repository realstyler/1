import multer from "multer";
import { ALLOWED_MIME_PREFIX, MAX_FILE_SIZE } from "../constants.js";
import ApiError from "../errors/apiError.js";

export const uploadImagesMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith(ALLOWED_MIME_PREFIX)) {
      cb(new ApiError("Only image files are allowed", 400));
      return;
    }
    cb(null, true);
  },
});