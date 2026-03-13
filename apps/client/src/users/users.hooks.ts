import { useMutation } from "@tanstack/react-query";
import { updateAvatarApi } from "./users.api";

export function useUpdateAvatar() {
  return useMutation({
    mutationFn: updateAvatarApi,
  });
}