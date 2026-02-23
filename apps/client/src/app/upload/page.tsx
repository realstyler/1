"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dropzone, ImagePreview } from "@/components/upload";
import { sampleRoomImage } from "@/data/mock";
import {
  useDeleteUploadedImages,
  useUploadImages,
} from "@/upload/image-upload.hooks";
import { createImageSignedUrlsApi } from "@/upload/image-upload.api";
import { StoredPath } from "@/types";

type UploadingStatus = "uploading" | "ready" | "error";

interface UploadedFile {
  id: string;
  file: File | null;
  preview: string;
  name: string;
  status: UploadingStatus;
  path?: string;
}

const MAX_FILES = 5;

export default function UploadPage() {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [isGlobalUploading, setIsGlobalUploading] = useState(false);
  const { mutateAsync: uploadImages } = useUploadImages();
  const { mutateAsync: deleteUploadedImages } = useDeleteUploadedImages();

  const handleImageSelect = async (files: File[]) => {
    if (files.length === 0) return;

    const remainingSlots = MAX_FILES - uploadedImages.length;
    if (remainingSlots <= 0) return;

    const filesToProcess = files.slice(0, remainingSlots);
    setIsGlobalUploading(true);

    const newUploads: UploadedFile[] = filesToProcess.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file), // Temporary preview
      name: file.name,
      status: "uploading",
    }));

    setUploadedImages((prev) => [...prev, ...newUploads]);

    const fd = new FormData();

    newUploads.forEach((f) => {
      fd.append("images", f.file!);
      fd.append("tmpIds", f.id);
    });

    uploadImages(fd, {
      onSuccess: (images) => {
        setUploadedImages((prev) => {
          const updated = prev.map((img) => {
            const uploaded = images.find((i) => i.tmpId === img.id);

            if (uploaded) {
              URL.revokeObjectURL(img.preview);
              return {
                ...img,
                status: "ready" as UploadingStatus,
                id: uploaded.id,
                path: uploaded.path,
                preview: uploaded.url,
              };
            }

            const wasUploading = newUploads.some((i) => i.id === img.id);
            if (wasUploading)
              return { ...img, status: "error" as UploadingStatus };

            return img;
          });

          const raw = sessionStorage.getItem("uploadedImages");
          const stored: StoredPath[] = raw ? JSON.parse(raw) : [];

          // Map for quick updates
          const storedMap = new Map(
            stored.map((s) => [s.id, [s.name, s.path]]),
          );

          updated.forEach((u) => {
            if (u.status === "ready" && u.path) {
              storedMap.set(u.id, [u.name, u.path]);
            }
          });

          const newStored: StoredPath[] = Array.from(storedMap.entries()).map(
            ([id, [name, path]]) => ({ id, name, path }),
          );

          sessionStorage.setItem("uploadedImages", JSON.stringify(newStored));

          return updated;
        });

        setIsGlobalUploading(false);
      },

      onError: () => {
        setUploadedImages((prev) =>
          prev.map((img) => {
            const wasUploading = newUploads.some((i) => i.id === img.id);
            if (!wasUploading) return img;
            return { ...img, status: "error" };
          }),
        );

        setIsGlobalUploading(false);
      },
    });
  };

  const handleRemove = async (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));

    const raw = sessionStorage.getItem("uploadedImages");
    if (raw) {
      const stored: StoredPath[] = JSON.parse(raw);
      const paths = stored.filter((s) => s.id !== id);
      sessionStorage.setItem("uploadedImages", JSON.stringify(paths));

      const path = stored.find((s) => s.id === id);
      if (path) await deleteUploadedImages(path.path);
    }
  };

  const handleUseSample = () => {
    if (uploadedImages.length >= MAX_FILES) return;

    const sampleId = Math.random().toString(36).substring(7);
    const sampleImage: UploadedFile = {
      id: sampleId,
      file: null,
      preview: sampleRoomImage,
      name: "sample-room.jpg",
      status: "ready",
    };

    setUploadedImages((prev) => [...prev, sampleImage]);
  };

  const handleContinue = () => {
    const raw = sessionStorage.getItem("uploadedImages");
    if (raw) {
      const stored: StoredPath[] = JSON.parse(raw);
      if (stored.length > 0) {
        sessionStorage.setItem("uploadedImage", JSON.stringify(stored[0]));
        router.push("/styles");
      }
    }
  };

  useEffect(() => {
    const restoreImages = async () => {
      const raw = sessionStorage.getItem("uploadedImages");
      if (!raw) return;

      const stored: StoredPath[] = JSON.parse(raw);
      if (stored.length === 0) return;

      const paths = stored.map((s) => s.path);
      const urls = await createImageSignedUrlsApi(paths);

      const restored = stored.map((s, index) => ({
        id: s.id,
        file: null,
        preview: urls[index],
        name: s.name,
        status: "ready" as const,
      }));

      setUploadedImages(restored);
    };

    restoreImages();
  }, []);

  return (
    <div className="min-h-screen py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif italic font-medium text-zinc-900 mb-6">
            Upload Your Room
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-lg font-light">
            Upload up to {MAX_FILES} photos of the rooms you want to transform.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="space-y-12">
          {/* Upload Area - Always visible if under limit */}
          {uploadedImages.length < MAX_FILES && (
            <div
              className={
                uploadedImages.length > 0
                  ? "max-w-2xl mx-auto"
                  : "max-w-3xl mx-auto"
              }
            >
              <Dropzone onImageSelect={handleImageSelect} />
            </div>
          )}

          {/* Image Grid */}
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {uploadedImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-sm relative">
                    <ImagePreview
                      src={img.preview}
                      name={img.name}
                      onRemove={() => handleRemove(img.id)}
                    />
                  </div>
                  {img.status === "uploading" ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl z-20">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mb-3" />
                        <span className="text-xs font-medium uppercase tracking-wider text-zinc-900">
                          Uploading...
                        </span>
                      </div>
                    </div>
                  ) : (
                    img.status === "error" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl z-20">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-medium uppercase tracking-wider text-zinc-900">
                            Failed to upload image
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sample Image Option (only if empty) */}
          {uploadedImages.length === 0 && (
            <div className="text-center">
              <span className="text-zinc-400 text-sm mb-4 block">or</span>
              <button
                onClick={handleUseSample}
                className="text-zinc-900 hover:text-zinc-600 font-medium text-sm border-b border-zinc-900 hover:border-zinc-600 pb-0.5 transition-colors"
              >
                Use a sample image
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/"
            className="px-8 py-3 text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
          >
            Back
          </Link>
          <button
            onClick={handleContinue}
            disabled={uploadedImages.length === 0 || isGlobalUploading}
            className={`px-10 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
              uploadedImages.length > 0 && !isGlobalUploading
                ? "bg-zinc-900 text-white hover:bg-black shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {isGlobalUploading ? "UPLOADING..." : "CHOOSE STYLE"}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-24 max-w-2xl mx-auto text-center border-t border-zinc-200 pt-12">
          <h3 className="font-serif italic text-xl text-zinc-900 mb-6">
            Tips for best results
          </h3>
          <ul className="space-y-3 text-zinc-500 text-sm">
            <li>Use a well-lit photo for better AI recognition</li>
            <li>Capture the entire room for more accurate transformations</li>
            <li>Avoid photos with complex geometry or blurry areas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
