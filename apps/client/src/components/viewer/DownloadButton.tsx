"use client";

import { useDownloadImage } from "@/images/images.hooks";

interface DownloadButtonProps {
  imageUrl: string;
  filename?: string;
}

export default function DownloadButton({
  imageUrl,
  filename = "styled-room.jpg",
}: DownloadButtonProps) {
  const { mutateAsync: downloadImage, isPending } = useDownloadImage();

  const getOriginalFilePath = (url: string) => {
    const baseUrl = url.split("?")[0];
    const parts = baseUrl.split("/real-styler/");
    const path = parts.length > 1 ? parts[1] : baseUrl;

    return path.replace("_thumb.", ".").replace(/_thumb$/, "");
  };

  const handleDownload = async () => {
    try {
      const originalPath = getOriginalFilePath(imageUrl);
      const blob = await downloadImage(originalPath);

      const downloadUrl = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isPending}
      className="relative overflow-hidden inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium rounded-full shadow-lg shadow-violet-500/25 group disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300 ease-out"></div>

      <span className="relative z-10 flex items-center gap-2">
        {isPending ? (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}
        {isPending ? "Downloading..." : "Download Result"}
      </span>
    </button>
  );
}
