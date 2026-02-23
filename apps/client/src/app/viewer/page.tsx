"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { BeforeAfterSlider, DownloadButton } from "@/components/viewer";
import { Style } from "@/types";
import { useGetJobsResultsApi } from "@/restyle/restyle.hooks";
import { Job } from "shared";

export default function ViewerPage() {
  const [jobIds, setJobIds] = useState<string[]>([]);
  const { data } = useGetJobsResultsApi(jobIds, true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);

  const images = useMemo(() => {
    if (!data) return [];

    return data
      .filter((j): j is Job => j !== null)
      .filter((j) => j.status === "completed" && j.input.url && j.result.url)
      .map((j) => ({
        before: j.input.url! as string,
        after: j.result.url! as string,
      }));
  }, [data]);

  useEffect(() => {
    const loadImages = async () => {
      const raw = localStorage.getItem("jobs");
      if (raw) {
        setJobIds(raw.split(","));
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    const storedStyle = sessionStorage.getItem("selectedStyle");
    const style = storedStyle ? JSON.parse(storedStyle) : null;
    setSelectedStyle(style);
  }, []);

  const currentImage = images[selectedImageIndex];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-400 text-sm font-medium">
              Transformation Complete
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">Your New Space</h1>
          <p className="text-black/60 max-w-xl mx-auto">
            {selectedStyle
              ? `Here's your room transformed with the ${selectedStyle.name} style.`
              : "Drag the slider to compare before and after."}
          </p>
        </div>

        {/* Main Viewer */}
        {currentImage && (
          <div className="mb-8">
            <BeforeAfterSlider
              beforeImage={currentImage.before}
              afterImage={currentImage.after}
            />
          </div>
        )}

        {/* Thumbnails (only if multiple) */}
        {images.length > 1 && (
          <div className="flex justify-center gap-4 mb-12 overflow-x-auto py-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === idx
                    ? "border-violet-500 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.after}
                  alt={`Result ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          {currentImage && <DownloadButton imageUrl={currentImage.after} />}

          <Link
            href="/styles"
            className="px-6 py-3 text-black/70 hover:text-black bg-black/5 hover:bg-black/10 border border-black/10 rounded-full transition-all duration-300"
          >
            Try Another Style
          </Link>

          <Link
            href="/upload"
            className="px-6 py-3 text-black/70 hover:text-black bg-black/5 hover:bg-black/10 border border-black/10 rounded-full transition-all duration-300"
          >
            New Photo
          </Link>
        </div>

        {/* Style Info Card */}
        {selectedStyle && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-black/5 border border-black/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-violet-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-black">
                  {selectedStyle.name}
                </h3>
                <p className="text-black/60 text-sm">
                  {selectedStyle.description}
                </p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-black/80 bg-black/10 rounded-full">
                  {selectedStyle.category}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold mb-4">Love your new design?</h3>
          <div className="flex items-center justify-center gap-4">
            {["Twitter", "Pinterest", "Facebook"].map((platform) => (
              <button
                key={platform}
                className="px-4 py-2 text-sm text-black/70 hover:text-black bg-black/5 hover:bg-black/10 border border-black/10 rounded-full transition-all duration-300"
              >
                Share on {platform}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
