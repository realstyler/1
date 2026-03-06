import { scrapeUrlApi } from "@/scrape-url/scrape-url.api";
import { useErrorToastStore } from "@/stores/useErrorToastStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { ScrapedImage } from "@/types";

export default function useScrapeUrl() {
  const [scrapedImages, setScrapedImages] = useState<ScrapedImage[]>([]);
  
  const {
    mutate: scrape,
    isPending: isPendingScraping,
  } = useMutation({
    mutationFn: scrapeUrlApi,
  });

  const { show: showError } = useErrorToastStore();

  const toggleSelect = (img: ScrapedImage) => {
    setScrapedImages((prev) =>
      prev.map((i) =>
        i.url === img.url ? { ...i, selected: !i.selected } : i,
      ),
    );
  };

  const resetScrapedImages = () => {
    setScrapedImages([]);
  };

  const scrapeUrl = async (url: string) => {
    scrape(url, {
      onSuccess: (data) => {
        const images = data.images.map((img: string) => ({
          url: img,
          selected: false,
        }));
        setScrapedImages(images);
      },
      onError: (error) => showError(error.message),
    });
  };

  return {
    isScraping: isPendingScraping,
    scrapedImages,
    toggleSelect,
    resetScrapedImages,
    scrapeUrl,
  };
}
