import { ScrapedImage } from "@/components/main/ScrapedImages";
import { scrapeUrlApi } from "@/scrape-url/scrape-url.api";
import { StoredPath } from "@/types";
import {
  useDeleteUploadedImages,
  useUploadImagesByUrls,
} from "@/upload/image-upload.hooks";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function useScrapeUrl() {
  const [scrapedImages, setScrapedImages] = useState<ScrapedImage[]>([]);
  const {
    mutateAsync: scrape,
    isPending: isPendingScraping,
    isError: isErrorScraping,
  } = useMutation({
    mutationFn: scrapeUrlApi,
  });

  const {
    mutateAsync: uploadImagesByUrls,
    isPending: isPendingUploadingByUrls,
    isError: isErrorUploading,
  } = useUploadImagesByUrls();

  const { mutateAsync: deleteUploadedImages } = useDeleteUploadedImages();

  const toggleSelect = (img: ScrapedImage) => {
    setScrapedImages((prev) =>
      prev.map((i) =>
        i.url === img.url ? { ...i, selected: !i.selected } : i,
      ),
    );
  };

  const resetScrapedImages = async () => {
    setScrapedImages([]);
  };

  const scrapeUrl = async (url: string) => {
    const res = await scrape(url);

    const images = res.images.map((img: string) => ({
      url: img,
      selected: false,
    }));

    setScrapedImages(images);
  };

  const handleUploadScrapedImages = async () => {
    const selectedScrapedImages = scrapedImages.filter((i) => i.selected);
    if (selectedScrapedImages.length === 0) return;

    await removeStoredImages();
    const urls = selectedScrapedImages.map((i) => i.url);
    const uploadRes = await uploadImagesByUrls(urls);
    const storage: StoredPath[] = uploadRes.map((r) => ({
      id: r.id,
      name: "image",
      path: r.path,
    }));

    sessionStorage.setItem("uploadedImages", JSON.stringify(storage));

    setScrapedImages([]);
  };

  const removeStoredImages = async () => {
    const raw = sessionStorage.getItem("uploadedImages");
    if (raw) {
      const stored: StoredPath[] = JSON.parse(raw);
      sessionStorage.removeItem("uploadedImages");

      const paths = stored.map((p) => p.path);
      if (paths.length > 0) await deleteUploadedImages(paths);
    }
  };

  return {
    isScraping: isPendingScraping,
    isUploading: isPendingUploadingByUrls,
    scrapedImages,
    toggleSelect,
    resetScrapedImages,
    scrapeUrl,
    handleUploadScrapedImages,
  };
}
