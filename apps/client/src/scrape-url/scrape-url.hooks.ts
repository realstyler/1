import { useMutation } from "@tanstack/react-query";
import { scrapeUrlApi } from "./scrape-url.api";

export function useScrapeUrl() {
  return useMutation({
    mutationFn: scrapeUrlApi,
  });
}
