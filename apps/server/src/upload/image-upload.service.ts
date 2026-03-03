import { supabaseAdmin } from "../lib/supabase.js";
import { v4 as uuidv4 } from "uuid";
import { environment } from "../config/environment.js";
import { BadRequestError, NotFoundError } from "../errors/apiErrors.js";
import { MAX_FILE_SIZE } from "../constants.js";
import type {
  GeneratedImage,
  UploadBufferParams,
  UploadedImage,
} from "../types/index.js";
import { ApiError } from "shared";

const BUCKET = environment.SUPABASE_BUCKET_NAME;

class ImageUploadService {
  async uploadTemporaryImages(
    files: Express.Multer.File[],
    tmpIds: string[],
  ): Promise<UploadedImage[]> {
    this.validateFiles(files);

    const results: UploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const tmpId = tmpIds[i]!;
      const id = uuidv4();
      const path = this.generateFilePath("tmp", id, file.mimetype);

      await this.uploadBuffer({
        buffer: file.buffer,
        mimeType: file.mimetype,
        path,
      });

      const url = await this.createSignedUrl(path, 300);
      results.push({
        tmpId,
        id,
        path,
        url,
      });
    }

    return results;
  }

  async uploadImagesByUrls(urls: string[]): Promise<UploadedImage[]> {
    const results: UploadedImage[] = [];

    for (const url of urls) {
      const response = await fetch(url);

      if (!response.ok) {
        throw new BadRequestError(`Failed to fetch image: ${url}`);
      }

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.startsWith("image/")) {
        throw new BadRequestError("Invalid image content-type");
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length > MAX_FILE_SIZE) {
        throw new BadRequestError("File exceeds maximum size");
      }

      const id = uuidv4();
      const path = this.generateFilePath("tmp", id, contentType);

      await this.uploadBuffer({
        buffer,
        mimeType: contentType,
        path,
      });

      const signedUrl = await this.createSignedUrl(path, 300);

      results.push({
        id,
        tmpId: "",
        path,
        url: signedUrl,
      });
    }

    return results;
  }

  async uploadGeneratedImage(params: {
    buffer: Buffer;
    mimeType: string;
  }): Promise<GeneratedImage> {
    const id = uuidv4();
    const path = this.generateFilePath("generated", id, params.mimeType);

    await this.uploadBuffer({
      buffer: params.buffer,
      mimeType: params.mimeType,
      path,
    });

    return { id, path };
  }

  async downloadImage(path: string): Promise<Blob> {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .download(path);

    if (error) {
      console.error(error);
      throw new ApiError("Failed to download image", 500);
    }

    return data;
  }

  async createSignedUrls(paths: string[], expires = 60 * 10) {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrls(paths, expires);

    if (error || !data) {
      console.error(error);
      throw new ApiError("Failed to create signed urls", 500);
    }

    return data.map((item) => {
      return item.signedUrl ?? null;
    });
  }

  async createSignedUrl(path: string, expires = 60 * 10): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(path, expires);

    if (error || !data?.signedUrl) {
      console.error(error);
      throw new ApiError(`Failed to create signed url for path ${path}`, 500);
    }

    return data.signedUrl;
  }

  async existImage(path: string) {
    const { data } = await supabaseAdmin.storage.from(BUCKET).exists(path);
    return data;
  }

  async existImageOrThrow(path: string) {
    const exist = await this.existImage(path);
    if (!exist) throw new NotFoundError(`Image not found by path ${path}`);
  }

  async deleteImages(paths: string[]) {
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove(paths);

    if (error) {
      console.error(error);
      throw new ApiError(`Failed to delete images for paths ${paths}`, 500);
    }
  }

  async moveTmpToOriginal(tmpPath: string, projectId: string) {
    if (!tmpPath.startsWith("tmp/")) {
      throw new BadRequestError("Image is not in the tmp directory");
    }
    
    const fileName = tmpPath.split("/").pop();
    const newPath = `original/${projectId}/${fileName}`;

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .move(tmpPath, newPath);

    if (error) {
      console.error(error);
      throw new ApiError(`Failed to move image to original folder: ${tmpPath}`, 500);
    }

    return newPath;
  }

  // =======================
  // Private helpers
  // =======================

  private validateFiles(files?: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new ApiError("No files uploaded", 400);
    }

    for (const file of files) {
      if (!file.mimetype.startsWith("image/")) {
        throw new ApiError(
          `Invalid file type: ${file.mimetype}. Only images are allowed`,
          400,
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new ApiError(
          `File "${file.originalname}" exceeds size limit`,
          400,
        );
      }
    }
  }

  private generateFilePath(
    folder: "tmp" | "generated",
    id: string,
    mimeType: string,
  ): string {
    const ext = mimeType.split("/")[1];
    return `${folder}/${id}.${ext}`;
  }

  private async uploadBuffer({
    buffer,
    mimeType,
    path,
  }: UploadBufferParams): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error(error);
      throw new ApiError(`Failed to upload image for path ${path}`, 500);
    }
  }

  private getPublicUrl(filePath: string): string {
    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);

    return data.publicUrl;
  }
}

export const imageUploadService = new ImageUploadService();
