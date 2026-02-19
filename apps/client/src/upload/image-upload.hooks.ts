import { useMutation } from "@tanstack/react-query";
import { uploadImagesApi } from "./image-upload.api";

export function useUploadImages() {
  return useMutation({
    mutationFn: uploadImagesApi,
  });
}