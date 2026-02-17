import { supabaseAdmin } from "../lib/supabase.js";
import { v4 as uuidv4 } from "uuid";
import { environment } from "../config/environment.js";
import { NotFoundError } from "../errors/apiErrors.js";
import { MAX_FILE_SIZE } from "../constants.js";
import unwrapSupabaseStorageError from "../utils/unwrapSupabaseStorageError.util.js";
import type { UploadBufferParams, UploadedImage } from "../types/index.js";
import { ApiError } from "shared";

const BUCKET = environment.SUPABASE_BUCKET_NAME;

class ImageUploadService {
  async uploadTemporaryImages(
    files: Express.Multer.File[],
  ): Promise<UploadedImage[]> {
    this.validateFiles(files);

    return Promise.all(
      files.map(async (file) => {
        const id = uuidv4();
        const filePath = this.generateFilePath("tmp", id, file.mimetype);

        await this.uploadBuffer({
          buffer: file.buffer,
          mimeType: file.mimetype,
          filePath,
        });

        const url = await this.createSignedUrl(filePath, 300);

        return { id, path: filePath, url };
      }),
    );
  }

  async uploadGeneratedImage(params: {
    buffer: Buffer;
    mimeType: string;
  }): Promise<UploadedImage> {
    const id = uuidv4();
    const filePath = this.generateFilePath("generated", id, params.mimeType);

    await this.uploadBuffer({
      buffer: params.buffer,
      mimeType: params.mimeType,
      filePath,
    });

    const url = await this.createSignedUrl(filePath, 300);

    return { id, path: filePath, url };
  }

  async downloadImage(filePath: string): Promise<Blob> {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .download(filePath);

    if (error) {
      const { message, status } = await unwrapSupabaseStorageError(error);
      throw new ApiError(message, status);
    }

    return data;
  }

  async createSignedUrls(paths: string[], expires = 60 * 10) {
    const results = await Promise.all(
      paths.map((p) =>
        supabaseAdmin.storage.from(BUCKET).createSignedUrl(p, expires),
      ),
    );

    return results.map((r) => r.data?.signedUrl ?? null);
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
      const { message, status } = await unwrapSupabaseStorageError(error);
      throw new ApiError(message, status);
    }
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
    filePath,
  }: UploadBufferParams): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      const { message, status } = await unwrapSupabaseStorageError(error);
      throw new ApiError(message, status);
    }
  }

  private async createSignedUrl(
    filePath: string,
    expiresInSeconds: number,
  ): Promise<string> {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      const { message, status } = await unwrapSupabaseStorageError(error);
      throw new ApiError(message, status);
    }

    return data.signedUrl;
  }

  private getPublicUrl(filePath: string): string {
    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);

    return data.publicUrl;
  }
}

export const imageUploadService = new ImageUploadService();
