"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUploadImages, useDeleteUploadedImages } from "@/images/images.hooks";
import { createImageSignedUrlsApi } from "@/images/images.api";
import { 
  ArrowLeft, 
  MoreHorizontal, 
  Trash2, 
  ChevronRight
} from 'lucide-react';
import { UploadedFile, UploadingStatus, StoredPath } from '@/types';
import { useGetProject, useAddProjectImages } from '@/projects/projects.hooks';
import ProjectDropzone from '@/components/projects/ProjectDropzone';
import { useErrorToastStore } from "@/stores/useErrorToastStore";
import { AxiosError } from "axios";

const MAX_FILES = 10;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const getStorageKey = (projectId: string) => `uploadedImages_project_${projectId}`;

export default function ProjectUploadPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const storageKey = getStorageKey(projectId);

  const [isNewProject, setIsNewProject] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [isRestoring, setIsRestoring] = useState(true);

  const { show: showError } = useErrorToastStore();

  const { mutateAsync: uploadImages } = useUploadImages();
  const { mutateAsync: deleteUploadedImages } = useDeleteUploadedImages();
  const { mutateAsync: addProjectImages, isPending: isAddingImages } = useAddProjectImages();

  const { data: project, isLoading: isProjectLoading } = useGetProject(projectId);

  useEffect(() => {
    const newProjectKey = `isNewProject_${projectId}`;
    const isNew = sessionStorage.getItem(newProjectKey);
    
    if (isNew === 'true') {
      setIsNewProject(true);
      sessionStorage.removeItem(newProjectKey);
    }
  }, [projectId]);

  useEffect(() => {
    const restoreImages = async () => {
      const raw = sessionStorage.getItem(storageKey);
      if (!raw) {
        setIsRestoring(false);
        return;
      }

      const stored: StoredPath[] = JSON.parse(raw);
      if (stored.length === 0) {
        setIsRestoring(false);
        return;
      }

      try {
        const paths = stored.map((s) => s.path);
        const urls = await createImageSignedUrlsApi(paths);

        const restored = stored.map((s, index) => ({
          id: s.id,
          file: null,
          preview: urls[index],
          name: s.name,
          status: "ready" as const,
          path: s.path
        }));

        setUploadedImages(restored);
      } catch (error) {
        console.error("Failed to restore images:", error);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreImages();
  }, [storageKey]);

  const processFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    const validFilesBySize: File[] = [];
    let hasOversizedFiles = false;

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        hasOversizedFiles = true;
      } else {
        validFilesBySize.push(file);
      }
    }

    if (hasOversizedFiles) {
      showError("One or more images exceed the 10MB size limit and were ignored.");
    }

    if (validFilesBySize.length === 0) return;

    const remainingSlots = MAX_FILES - uploadedImages.length;
    if (remainingSlots <= 0) return;

    const validFiles = validFilesBySize
      .filter(file => file.type === 'image/jpeg' || file.type === 'image/png')
      .slice(0, remainingSlots);

    if (validFiles.length === 0) return;

    const newUploads: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
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
        let hasPartialError = false;

        setUploadedImages((prev) => {
          const updated: UploadedFile[] = [];

          prev.forEach((img) => {
            const uploaded = images.find((i) => i.tmpId === img.id);

            if (uploaded) {
              if (img.preview.startsWith('blob:')) {
                URL.revokeObjectURL(img.preview);
              }
              updated.push({
                ...img,
                status: "ready" as UploadingStatus,
                id: uploaded.id,
                path: uploaded.path,
                preview: uploaded.url,
              });
            } else {
              const wasUploading = newUploads.some((i) => i.id === img.id);
              if (wasUploading) {
                hasPartialError = true;
              } else {
                updated.push(img);
              }
            }
          });

          const raw = sessionStorage.getItem(storageKey);
          const stored: StoredPath[] = raw ? JSON.parse(raw) : [];

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

          sessionStorage.setItem(storageKey, JSON.stringify(newStored));

          return updated;
        });

        if (hasPartialError) {
          showError("Some images failed to upload.");
        }
      },
      onError: (error) => {
        setUploadedImages((prev) =>
          prev.filter((img) => !newUploads.some((i) => i.id === img.id))
        );

        const err = error as AxiosError<{ message: string }>;
        const errorMessage = err.response?.data?.message || err.message || "Failed to upload image.";
        showError(errorMessage);
      },
    });
  }, [uploadedImages.length, uploadImages, storageKey, showError]);

  const handleDelete = async (id: string, path?: string) => {
    setUploadedImages(prev => {
      const imgToDelete = prev.find(img => img.id === id);
      if (imgToDelete && imgToDelete.preview.startsWith('blob:')) {
        URL.revokeObjectURL(imgToDelete.preview);
      }
      return prev.filter(img => img.id !== id);
    });

    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const stored: StoredPath[] = JSON.parse(raw);
      const paths = stored.filter((s) => s.id !== id);
      sessionStorage.setItem(storageKey, JSON.stringify(paths));
    }

    if (path) {
      await deleteUploadedImages(path);
    }
  };

  const handleDone = async () => {
    const pathsToSave = uploadedImages
      .filter(img => img.status === "ready" && img.path)
      .map(img => img.path as string);

    if (pathsToSave.length > 0) {
      try {
        const imagesData = pathsToSave.map(path => ({
          originalPath: path,
          styledImages: []
        }));

        await addProjectImages({ projectId, imagesData });
        sessionStorage.removeItem(storageKey);
        router.push(`/projects/${projectId}`);
      } catch (error) {
        console.error("Failed to save images to project:", error);
        const err = error as AxiosError<{ message: string }>;
        const errorMessage = err.response?.data?.message || err.message || "Failed to save project images. Please try again.";
        showError(errorMessage);
      }
    } else {
      sessionStorage.removeItem(storageKey);
      router.push(`/projects/${projectId}`);
    }
  };

  if (isProjectLoading || isRestoring) {
    return (
      <div className="bg-[#f8f8f7] h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#2d2d2d] animate-spin mb-4" />
        <p className="text-[10px] font-black text-[#8e94a0] uppercase tracking-[0.15em]">
          {isProjectLoading ? "Loading project..." : "Restoring images..."}
        </p>
      </div>
    );
  }

  if (!project) return <div className="h-screen flex items-center justify-center font-luxury-serif text-2xl">Project not found</div>;

  return (
    <div className="bg-[#f8f8f7] h-[calc(100vh-80px)] text-[#1a1a1a] overflow-hidden">
      <main className="h-full max-w-350 mx-auto pt-12 pb-6 flex flex-col px-6">
        
        <div className="flex-1 w-full max-w-250 mx-auto flex flex-col min-h-0">
          
          <div className="flex items-center justify-between mb-10 shrink-0">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => router.back()}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90 shadow-sm"
              >
                <ArrowLeft size={20} strokeWidth={1.5} className="text-[#1a1a1a]" />
              </button>
              <div>
                <h1 className="text-[32px] font-luxury-serif leading-none tracking-tight text-[#1a1a1a] mb-1.5">
                  {project.name}
                </h1>
                <p className="text-[#8e94a0] font-medium text-[13px]">
                  {isNewProject ? "New Project" : "Add Images"}
                </p>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-700 transition-colors p-1">
              <MoreHorizontal size={28} strokeWidth={2} />
            </button>
          </div>

          <ProjectDropzone 
            onFilesSelect={processFiles} 
            uploadedCount={uploadedImages.length} 
            maxFiles={MAX_FILES} 
          />

          <div className="shrink-0 px-1 mb-4">
            <p className="text-[12px] font-bold text-[#87817c] mb-3">
              Uploaded <span className="text-[#d7d3d2]">{uploadedImages.length}/{MAX_FILES}</span>
            </p>
            
            <div className="flex flex-row gap-4 overflow-x-auto pb-2 no-scrollbar min-h-26.25">
                {uploadedImages.map((img) => (
                  <div 
                    key={img.id} 
                    className="relative w-24 h-24 shrink-0 rounded-[18px] overflow-hidden border border-gray-200 shadow-sm group bg-gray-50"
                  >
                    <Image 
                      src={img.preview} 
                      alt={img.name}
                      fill
                      sizes="96px"
                      unoptimized={img.preview.startsWith('blob:')}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {img.status === "ready" && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(img.id, img.path);
                        }}
                        className="group/btn absolute top-2 right-2 w-7 h-7 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110 z-10"
                      >
                        <Trash2 size={13} className="text-[#949ba6] group-hover/btn:text-red-500 transition-colors duration-200" />
                      </button>
                    )}

                    {img.status === "uploading" && (
                      <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
                        <span className="text-[10px] font-bold text-gray-400">Processing</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2 flex justify-end shrink-0 max-w-250 mx-auto w-full">
          {isNewProject && uploadedImages.length === 0 ? (
            <button 
              onClick={() => router.push(`/projects/${projectId}`)}
              className="text-[#8e94a0] font-bold text-xs hover:text-black transition-colors flex items-center gap-1.5 group pr-1"
            >
              Skip for now
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </button>
          ) : (
            <button 
              onClick={handleDone}
              disabled={uploadedImages.some(img => img.status === "uploading") || isAddingImages}
              className="bg-black text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/20 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isAddingImages ? "Saving..." : "Done"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}