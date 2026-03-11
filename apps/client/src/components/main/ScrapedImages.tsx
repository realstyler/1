"use client";

import { useState } from "react";
import Image from "next/image";
import { useUploadImages } from "@/upload/images.hooks";
import type { ScrapedImage, UploadResponse } from "@/types";

interface Props {
  scrapedImages: ScrapedImage[];
  onSelectImg: (img: ScrapedImage) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ScrapedImages({
  scrapedImages,
  onSelectImg,
  onCancel,
  onSubmit,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadImages } = useUploadImages();

  if (scrapedImages.length === 0) return null;

  const selectedImages = scrapedImages.filter((i) => i.selected);
  const selectedCount = selectedImages.length;

  const handleContinue = async () => {
    if (selectedCount === 0) return;

    setIsUploading(true);

    try {
      const filesWithIds: { file: File; id: string }[] = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const img = selectedImages[i];
        const res = await fetch(img.url);

        if (!res.ok) {
          console.error(`Error: Server returned status ${res.status} for ${img.url}`);
          continue; 
        }

        const blob = await res.blob();

        if (!blob.type.startsWith("image/")) {
          console.error(`Error: Received file type ${blob.type} instead of image for ${img.url}`);
          continue;
        }

        const file = new File([blob], `scraped-image-${i + 1}.jpg`, {
          type: blob.type,
        });

        filesWithIds.push({
          file,
          id: Math.random().toString(36).substring(7),
        });
      }

      if (filesWithIds.length === 0) {
        console.error("No valid images were downloaded. Upload cancelled.");
        setIsUploading(false);
        return; 
      }

      const fd = new FormData();
      filesWithIds.forEach((f) => {
        fd.append("images", f.file);
        fd.append("tmpIds", f.id);
      });

      await uploadImages(fd, {
        onSuccess: (uploadedFiles: UploadResponse[]) => {
          const raw = sessionStorage.getItem("uploadedImages");
          const stored = raw ? JSON.parse(raw) : [];

          const newStored = uploadedFiles.map((uploaded: UploadResponse) => {
            const matchedFile = filesWithIds.find((f) => f.id === uploaded.tmpId);
            
            if (!uploaded.path) {
              console.warn(`Warning: Backend did not return 'path' for file ${uploaded.tmpId}`);
            }

            return {
              id: uploaded.id || uploaded.tmpId,
              name: matchedFile ? matchedFile.file.name : "scraped-image.jpg",
              path: uploaded.path,
            };
          });

          const finalStorage = [...stored, ...newStored];
          sessionStorage.setItem("uploadedImages", JSON.stringify(finalStorage));

          setIsUploading(false);
          onSubmit();
        },
        onError: (error) => {
          console.error("Backend error during upload:", error);
          setIsUploading(false);
        },
      });
    } catch (error) {
      console.error("Critical error during processing:", error);
      setIsUploading(false);
    }
  };

  return (
    <section className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-serif">Select Images</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose the rooms you want to restyle
          </p>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {scrapedImages.map((img) => (
              <div
                key={img.url}
                onClick={() => !isUploading && onSelectImg(img)}
                className={`relative h-48 cursor-pointer group rounded-xl overflow-hidden border transition-all duration-200 ${
                  img.selected
                    ? "border-black ring-2 ring-black"
                    : "border-gray-200 hover:border-gray-400"
                } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Image
                  src={img.url}
                  alt="Scraped image preview"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  unoptimized={true}
                  className="object-cover"
                />

                {/* Overlay */}
                <div
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                    img.selected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    {img.selected && (
                      <svg
                        className="w-5 h-5 text-black"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {selectedCount} selected
          </span>

          <div>
            <button
              onClick={onCancel}
              disabled={isUploading}
              className={`px-6 py-3 cursor-pointer font-medium text-black mr-5 ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>

            <button
              disabled={selectedCount === 0 || isUploading}
              onClick={handleContinue}
              className={`px-6 py-3 cursor-pointer rounded-full font-medium transition ${
                selectedCount > 0 && !isUploading
                  ? "bg-black text-white hover:bg-neutral-800"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isUploading ? "Uploading..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}