import { useMutation } from "@tanstack/react-query";
import {
  deleteUploadedImagesApi,
  uploadImagesApi,
  uploadImagesByUrlsApi,
  downloadImageApi,
} from "./images.api";

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

export function useDownloadImage() {
  return useMutation({
    mutationFn: downloadImageApi,
  });
}