"use client";

import React, { useRef } from "react";
import Link from "next/link";

interface HeroUploadCardProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  setLoadedImage: (file: File | null) => void;
  inputError: boolean;
  setInputError: (error: boolean) => void;
  selectedStyle: string;
  setSelectedStyle: (style: string) => void;
  isScraping: boolean;
  isUploading: boolean;
  isPendingUploading: boolean;
  onGenerateRender: () => void;
}

export default function HeroUploadCard({
  imageUrl,
  setImageUrl,
  setLoadedImage,
  inputError,
  setInputError,
  selectedStyle,
  setSelectedStyle,
  isScraping,
  isUploading,
  isPendingUploading,
  onGenerateRender,
}: HeroUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      URL.revokeObjectURL(imageUrl);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setLoadedImage(file);
      setInputError(false);
    }
  };

  return (
    <div className="space-y-4 bg-white p-5 rounded-[20px] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] max-w-md w-full pb-3">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload area with icon button and URL input */}
      <div className="flex items-center gap-2.5 px-1 pt-0.5">
        <button
          type="button"
          onClick={handleFileClick}
          className="shrink-0 cursor-pointer text-neutral-400 hover:text-neutral-600 transition"
          aria-label="Upload image file"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M16 3h6" />
            <path d="M19 0v6" />
          </svg>
        </button>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => {
            setImageUrl(e.target.value);
            setInputError(false);
            setLoadedImage(null);
          }}
          placeholder="Paste image URL or upload..."
          className={`flex-1 bg-transparent text-[14px] text-neutral-600 placeholder:text-neutral-300 outline-none
            ${inputError ? "text-red-500 placeholder:text-red-300" : ""}
          `}
        />
      </div>

      <hr className="border-neutral-100" />

      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
            Style Preset
          </span>
          <Link
            href="#"
            className="text-[10px] text-neutral-300 hover:text-neutral-400 underline decoration-neutral-200 underline-offset-2 transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 px-1.5">
          {["Modern", "Nordic", "Luxe"].map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`py-2 cursor-pointer text-[12px] font-medium rounded-lg transition-all ${
                selectedStyle === style
                  ? "bg-[#111111] text-white shadow-md"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={isScraping || isUploading || isPendingUploading}
        className="w-[calc(100%+16px)] -ml-2 cursor-pointer bg-[#111111] hover:bg-[#2d2d2d] text-white py-3 rounded-xl text-[14px] font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md mt-1"
        onClick={onGenerateRender}
      >
        {isScraping || isUploading || isPendingUploading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            {isUploading || isPendingUploading ? "Uploading..." : "Scraping..."}
          </>
        ) : (
          <>
            Generate Render
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}