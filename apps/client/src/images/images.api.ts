import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { UploadedImageApi } from "@/types";

export const uploadImagesApi = async (fd: FormData) =>
  fetcher<UploadedImageApi[]>(api.post("/api/upload", fd));

export const uploadImagesByUrlsApi = async (urls: string[]) =>
  fetcher<UploadedImageApi[]>(
    api.post("/api/upload-by-urls", {
      urls,
    }),
  );

export const createImageSignedUrlsApi = async (paths: string[]) =>
  fetcher<string[]>(
    api.get("/api/signed", {
      params: { paths: paths.join(",") },
    }),
  );

export const deleteUploadedImagesApi = async (paths: string[] | string) =>
  fetcher<void>(
    api.delete("/api/uploaded-tmp", {
      params: {
        paths: (Array.isArray(paths) ? paths : [paths]).join(","),
      },
    }),
  );

export const downloadImageApi = async (path: string) => {
  const response = await api.get("/api/download", {
    params: { path },
    responseType: "blob",
  });
  return response.data;
};