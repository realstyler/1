import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";

export const scrapeUrlApi = async (url: string) =>
  fetcher<{ images: string[] }>(api.post("/api/scrape-url", { url }));
