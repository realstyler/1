import { scrapeUrlApi } from "@/scrape-url/scrape-url.api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { ScrapedImage } from "@/types";

export default function useScrapeUrl() {
  const [scrapedImages, setScrapedImages] = useState<ScrapedImage[]>([]);
  
  const {
    mutateAsync: scrapeAsync,
    isPending: isPendingScraping,
  } = useMutation({
    mutationFn: scrapeUrlApi,
  });

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
    const data = await scrapeAsync(url);
    
    const images = (data.images || []).map((img: string) => ({
      url: img,
      selected: false,
    }));
    
    setScrapedImages(images);
    
    return images; 
  };

  return {
    isScraping: isPendingScraping,
    scrapedImages,
    toggleSelect,
    resetScrapedImages,
    scrapeUrl,
  };
}