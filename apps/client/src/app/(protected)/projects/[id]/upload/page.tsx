"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useUploadImages, useDeleteUploadedImages } from "@/upload/image-upload.hooks";
import { createImageSignedUrlsApi } from "@/upload/image-upload.api";
import { 
  ArrowLeft, 
  MoreHorizontal, 
  UploadCloud, 
  Trash2, 
  ChevronRight,
  Upload,
  AlertCircle
} from 'lucide-react';
import { UploadedFile, UploadingStatus, StoredPath } from '@/types';
import { useGetProject } from '@/projects/projects.hooks';

const MAX_FILES = 10;

const getStorageKey = (projectId: string) => `uploadedImages_project_${projectId}`;

export default function ProjectUploadPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const isNewProject = searchParams.get('new') === 'true';
  const storageKey = getStorageKey(projectId);

  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadImages } = useUploadImages();
  const { mutateAsync: deleteUploadedImages } = useDeleteUploadedImages();

  const { data: project, isLoading: isProjectLoading } = useGetProject(projectId);

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

    const remainingSlots = MAX_FILES - uploadedImages.length;
    if (remainingSlots <= 0) return;

    const validFiles = files
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
        setUploadedImages((prev) => {
          const updated = prev.map((img) => {
            const uploaded = images.find((i) => i.tmpId === img.id);

            if (uploaded) {
              if (img.preview.startsWith('blob:')) {
                URL.revokeObjectURL(img.preview);
              }
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
      },
      onError: () => {
        setUploadedImages((prev) =>
          prev.map((img) => {
            const wasUploading = newUploads.some((i) => i.id === img.id);
            if (!wasUploading) return img;
            return { ...img, status: "error" };
          }),
        );
      },
    });
  }, [uploadedImages.length, uploadImages, storageKey]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  const handleDone = () => {
    sessionStorage.removeItem(storageKey);
    router.push(`/projects/${projectId}`);
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
      <main className="h-full max-w-[1400px] mx-auto pt-12 pb-6 flex flex-col px-6">
        
        <div className="flex-1 w-full max-w-[1000px] mx-auto flex flex-col min-h-0">
          
          {/* Header Section */}
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

          {/* Hidden Input */}
          <input 
            type="file" 
            ref={fileInputRef} 
            hidden 
            multiple 
            accept="image/jpeg, image/png" 
            onChange={handleFileSelect} 
          />

          {/* Upload Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 min-h-[320px] border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center bg-white transition-all cursor-pointer group mb-6 relative shadow-sm ${
              isDragging ? 'border-[#8ea28d] bg-[#fdfefd] scale-[1.01]' : 'border-[#d1d7cb] hover:border-[#b5bcaf]'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${
              isDragging ? 'bg-[#8ea28d]/10 scale-110' : 'bg-[#f8f8f7] group-hover:scale-110'
            }`}>
              <UploadCloud size={22} className={isDragging ? 'text-[#8ea28d]' : 'text-[#949ba6]'} strokeWidth={1.5} />
            </div>

            <h2 className="text-[22px] md:text-[24px] font-luxury-serif mb-2 tracking-tight text-center">
              Drop your photos here
            </h2>
            
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-[#8e94a0] text-xs font-serif italic">or</span>
              <button 
                type="button"
                className="bg-[#2d2d2d] text-white px-5 py-2 rounded-full font-bold text-[12px] hover:bg-black transition-all active:scale-95 shadow-md flex items-center gap-2"
              >
                <Upload size={13} />
                Browse to upload
              </button>
            </div>

            <p className="text-[#b1b5bd] text-[9px] font-black uppercase tracking-[0.2em]">
              JPEG, PNG • UP TO {MAX_FILES} IMAGES
            </p>

            {uploadedImages.length >= MAX_FILES && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[32px] flex flex-col items-center justify-center z-10 cursor-not-allowed">
                 <AlertCircle size={32} className="text-[#e17a5f] mb-3" strokeWidth={1.5} />
                 <h3 className="font-luxury-serif text-xl tracking-tight text-[#1a1a1a]">Maximum limit reached</h3>
                 <p className="text-sm text-[#8e94a0] mt-1">You can upload up to {MAX_FILES} images</p>
              </div>
            )}
          </div>

          {/* Image Preview List */}
          <div className="shrink-0 px-1 mb-4">
            <p className="text-[12px] font-bold text-[#87817c] mb-3">
              Uploaded <span className="text-[#d7d3d2]">{uploadedImages.length}/{MAX_FILES}</span>
            </p>
            
            <div className="flex flex-row gap-4 overflow-x-auto pb-2 no-scrollbar min-h-[105px]">
                {uploadedImages.map((img) => (
                  <div 
                    key={img.id} 
                    className="relative w-24 h-24 shrink-0 rounded-[18px] overflow-hidden border border-gray-200 shadow-sm group bg-gray-50"
                  >
                    <img 
                      src={img.preview} 
                      alt={img.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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

                    {img.status === "error" && (
                      <div className="absolute inset-0 bg-red-50/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                        <AlertCircle size={16} className="text-red-500 mb-1" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Error</span>
                        <button 
                          onClick={() => handleDelete(img.id)}
                          className="absolute top-1 right-1 p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <Trash2 size={10} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-auto pt-2 flex justify-end shrink-0 max-w-[1000px] mx-auto w-full">
          {isNewProject ? (
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
              disabled={uploadedImages.some(img => img.status === "uploading")}
              className="bg-black text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/20 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Done
            </button>
          )}
        </div>
      </main>
    </div>
  );
}