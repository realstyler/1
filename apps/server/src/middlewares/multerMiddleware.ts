import multer from "multer";
import { ALLOWED_MIME_PREFIX, MAX_FILE_SIZE } from "../constants.js";
import { BadRequestError } from "../errors/apiErrors.js";

export const uploadImagesMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith(ALLOWED_MIME_PREFIX)) {
      cb(new BadRequestError("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});
