import { supabaseAdmin } from "../lib/supabase.js";
import { v4 as uuidv4 } from "uuid";
import { environment } from "../config/environment.js";
import ApiError from "../errors/apiError.js";
import { MAX_FILE_SIZE } from "../constants.js";
import unwrapSupabaseStorageError from "../utils/unwrapSupabaseStorageError.util.js";

class ImageUploadService {
  async uploadTemporaryImages(files: Express.Multer.File[]) {
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
          `File "${file.originalname}" exceeds 10MB limit`,
          400,
        );
      }
    }

    const results = [];

    for (const file of files) {
      const fileId = uuidv4();
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${fileId}.${fileExt}`;
      const filePath = `tmp/${fileName}`;

      const signedUrl = await this.uploadToSupabase({
        file,
        bucketName: environment.SUPABASE_BUCKET_NAME,
        filePath,
      });

      results.push({ id: fileId, url: signedUrl! });
    }

    return results;
  }

  async uploadGeneratedImage(params: { buffer: Buffer; mimeType: string }) {
    const fileId = uuidv4();
    const ext = params.mimeType.split("/")[1];
    const filePath = `generated/${fileId}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(environment.SUPABASE_BUCKET_NAME)
      .upload(filePath, params.buffer, {
        contentType: params.mimeType,
        upsert: false,
      });

    if (error) {
      const { message, status } = await unwrapSupabaseStorageError(error);
      throw new ApiError(message, status);
    }

    const { data } = await supabaseAdmin.storage
      .from(environment.SUPABASE_BUCKET_NAME)
      .getPublicUrl(filePath);

    return {
      path: filePath,
      url: data.publicUrl,
    };
  }

  async downloadImage(filePath: string) {
    return await this.downloadFromSupabase(
      environment.SUPABASE_BUCKET_NAME,
      filePath,
    );
  }

  private async uploadToSupabase({
    file,
    bucketName,
    filePath,
  }: {
    file: Express.Multer.File;
    bucketName: string;
    filePath: string;
  }) {
    const { error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      const { message, status } = await unwrapSupabaseStorageError(error);
      throw new ApiError(message, status);
    }

    const { data: urlData, error: storageError } = await supabaseAdmin.storage
      .from(bucketName)
      .createSignedUrl(filePath, 300); // 5 minutes

    if (storageError) {
      const { message, status } =
        await unwrapSupabaseStorageError(storageError);
      throw new ApiError(message, status);
    }

    return urlData?.signedUrl;
  }

  private async downloadFromSupabase(bucketName: string, filePath: string) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      const { message, status } = await unwrapSupabaseStorageError(error);
      throw new ApiError(message, status);
    }

    return data;
  }
}

export const imageUploadService = new ImageUploadService();
