import { useMutation } from "@tanstack/react-query";
import {
  deleteUploadedImagesApi,
  uploadImagesApi,
  uploadImagesByUrlsApi,
} from "./image-upload.api";

export function useUploadImages() {
  return useMutation({
    mutationFn: uploadImagesApi,
  });
}

export function useUploadImagesByUrls() {
  return useMutation({
    mutationFn: uploadImagesByUrlsApi,
  });
}

export function useDeleteUploadedImages() {
  return useMutation({
    mutationFn: deleteUploadedImagesApi,
  });
}
