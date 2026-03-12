import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { Style } from "@/types";

export const getStylesApi = async () =>
  fetcher<Style[]>(api.get("/api/styles"));