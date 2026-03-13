import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export const updateAvatarApi = async (avatarPath: string) =>
  fetcher<any>(api.patch("/api/users/avatar", { avatarPath }));