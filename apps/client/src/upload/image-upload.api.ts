import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { UploadedImageApi } from "@/types";

export const uploadImagesApi = async (fd: FormData) =>
  fetcher<UploadedImageApi[]>(api.post("/api/upload", fd));

export const createImageSignedUrlsApi = async (paths: string[]) =>
  fetcher<string[]>(
    api.get("/api/signed", {
      params: { paths: paths.join("&&&") },
    }),
  );

export const deleteUploadedImageApi = async (path: string) =>
  fetcher<void>(
    api.delete("/api/uploaded-tmp", {
      params: {
        path,
      },
    }),
  );
