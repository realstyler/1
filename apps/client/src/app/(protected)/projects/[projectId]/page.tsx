"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SidebarOptions from "@/components/projects/SidebarOptions";
import { ArrowLeft, MapPin, Upload, Download, Plus, Wand2, Library } from "lucide-react";
import { useGetProject, useAddStyledImages } from "@/projects/projects.hooks";
import { startRestyleApi, getJobsResultsApi } from "@/restyle/restyle.api";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isRestyling, setIsRestyling] = useState(false);
  const [pendingGenerations, setPendingGenerations] = useState<{ id: string; url: string }[]>([]);

  const { data: project, isLoading } = useGetProject(projectId, true);
  const addStyledImagesMutation = useAddStyledImages();

  const displayImages = useMemo(() => {
    return (project?.originalImages || []).flatMap((img) => {
      const items = [];
      
      if (img.originalUrl) {
        items.push({
          id: `${img.id}-original`,
          originalId: img.id,
          originalPath: img.originalPath,
          url: img.originalUrl,
          isRestyled: false,
        });
      }

      if (img.styledImages && img.styledImages.length > 0) {
        img.styledImages.forEach((styled) => {
          if (styled.restyledUrl) {
            items.push({
              id: `${styled.id}-restyled`,
              originalId: img.id,
              originalPath: img.originalPath,
              url: styled.restyledUrl,
              isRestyled: true,
            });
          }
        });
      }

      return items;
    });
  }, [project?.originalImages]);

  const selectedImagesSet = useMemo(() => new Set(selectedImages), [selectedImages]);

  const toggleImageSelection = useCallback((id: string) => {
    setSelectedImages((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const pollJobs = async (jobIds: string[], originalImagesData: any[], maxAttempts = 30) => {
    let attempts = 0;
    
    return new Promise<any[]>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          attempts++;
          const jobsData = await getJobsResultsApi(jobIds, true);
          
          const allCompletedOrFailed = jobsData.every(
            (job) => job === null || job.status === "completed" || job.status === "failed_final"
          );

          if (allCompletedOrFailed || attempts >= maxAttempts) {
            clearInterval(interval);
            
            const successfulResults = jobsData
              .filter((j) => j && j.status === "completed" && j.result?.path)
              .map((job, index) => ({
                originalId: originalImagesData[index].originalId,
                restyledPath: job!.result!.path as string,
              }));
              
            resolve(successfulResults);
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 3000); 
    });
  };

  const handleRestyle = async (settings: any) => {
    const selectedOriginals = displayImages.filter(
      (img) => selectedImages.includes(img.id) && !img.isRestyled
    );

    if (selectedOriginals.length === 0) return;

    setIsRestyling(true);
    
    setPendingGenerations(
      selectedOriginals.map(img => ({ id: img.originalId, url: img.url }))
    );
    
    setSelectedImages([]);

    try {
      const aiModel = "gemini";
      const selectedStyle = settings.aestheticPreset;
      const pathsToRestyle = selectedOriginals.map(img => img.originalPath);

      const jobIds = await startRestyleApi({
        paths: pathsToRestyle,
        model: aiModel,
        style: selectedStyle as any, 
      });

      if (!jobIds || jobIds.length === 0) {
        throw new Error("Failed to start restyle jobs");
      }

      const completedResults = await pollJobs(jobIds, selectedOriginals);

      if (completedResults.length > 0) {
        const styledImagesPayload = completedResults.map(result => ({
          originalId: result.originalId,
          restyledPath: result.restyledPath,
          lighting: settings.lighting?.toUpperCase() || "NATURAL",
          creativity: settings.creativity?.toUpperCase() || "BALANCED",
          aesthetic: settings.aestheticLabel?.toUpperCase() || "MODERN"
        }));

        await addStyledImagesMutation.mutateAsync({
          projectId,
          styledImages: styledImagesPayload
        });
      }

    } catch (error) {
      console.error("Failed to restyle images:", error);
    } finally {
      setIsRestyling(false);
      setPendingGenerations([]);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f8f8f7] h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#2d2d2d] animate-spin mb-4" />
        <p className="text-[10px] font-black text-[#8e94a0] uppercase tracking-[0.15em]">
          Loading project...
        </p>
      </div>
    );
  }

  if (!project)
    return (
      <div className="h-screen flex items-center justify-center font-luxury-serif text-2xl">
        Project not found
      </div>
    );

  return (
    <div className="bg-[#f8f8f7] min-h-[calc(100vh-80px)] text-[#1a1a1a]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      <main className="max-w-400 mx-auto px-6 py-8 flex items-start gap-10">
        <div className="flex-1 w-full">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4 pl-2">
            <div className="flex items-center gap-6">
              <button
                onClick={() => router.push("/projects")}
                className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
              >
                <ArrowLeft size={20} strokeWidth={1.5} className="text-[#1a1a1a]" />
              </button>
              <div>
                <h1 className="text-[32px] font-luxury-serif leading-none tracking-tight text-[#1a1a1a] mb-1.5">
                  {project.name}
                </h1>
                {project.address && (
                  <div className="flex items-center gap-1 text-[#8e94a0] font-medium text-[13px]">
                    <MapPin size={14} strokeWidth={2} className="text-[#b1b5bd]" />
                    {project.address}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pr-2">
              <span className="text-[12px] font-semibold text-[#8e94a0] uppercase tracking-[0.15em]">
                {selectedImages.length} Selected
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/projects/${projectId}/upload`)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-full font-semibold text-[14px] hover:bg-gray-50 transition-all shadow-sm"
                >
                  <Upload size={16} strokeWidth={2} className="text-[#1a1a1a]" />
                  Upload
                </button>

                <button
                  onClick={() => router.push(`/projects/${projectId}/library`)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#8ea28d] text-white rounded-full font-semibold text-[14px] hover:bg-[#7a8e79] transition-all shadow-md"
                >
                  <Library size={16} strokeWidth={2} />
                  Create Collection
                </button>

                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#2d2d2d] text-white rounded-full font-semibold text-[14px] hover:bg-black transition-all shadow-md">
                  Export
                  <Download size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          <div className={`w-full ${displayImages.length === 0 && pendingGenerations.length === 0 ? "bg-white border border-gray-100 rounded-4xl min-h-100" : ""}`}>
            {displayImages.length > 0 || pendingGenerations.length > 0 ? (
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6 pt-2 pb-16">
                
                {pendingGenerations.map((pending, idx) => (
                  <div key={`pending-${pending.id}-${idx}`} className="relative break-inside-avoid mb-6 rounded-3xl overflow-hidden border-2 border-transparent shadow-sm bg-gray-50 aspect-4/3 flex items-center justify-center">
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <Image 
                        src={pending.url} 
                        alt="Processing" 
                        fill 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover" 
                      />
                      <div className="absolute inset-0 bg-white/60" />
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-6">
                      <div className="w-14 h-14 rounded-full border-4 border-[#8b9a7d]/40 border-t-[#8b9a7d] animate-spin" />
                      
                      <div className="flex items-center gap-2.5 px-6 py-3 bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
                        <Wand2 size={16} strokeWidth={2} className="text-[#8b9a7d]" />
                        <span className="text-[14px] font-semibold text-[#4b5563] tracking-wide">Styling...</span>
                      </div>
                    </div>
                  </div>
                ))}

                {displayImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => toggleImageSelection(img.id)}
                    className={`relative break-inside-avoid mb-6 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                      selectedImagesSet.has(img.id)
                        ? "border-[#8ea28d] shadow-md"
                        : "border-transparent shadow-sm hover:border-gray-200"
                    } group bg-white`}
                  >
                    <Image
                      src={img.url}
                      alt="Project view"
                      width={1200}
                      height={800}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
                    />

                    <div
                      className={`absolute top-4 left-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedImagesSet.has(img.id)
                          ? "bg-[#8ea28d] border-[#8ea28d]"
                          : "bg-white/80 backdrop-blur-sm border-white shadow-sm"
                      }`}
                    >
                      {selectedImagesSet.has(img.id) && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {img.isRestyled && (
                      <div className="absolute top-4 right-4 bg-[#8ea28d]/90 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full">
                        Styled
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center p-6 min-h-100">
                <div className="w-14 h-14 bg-white rounded-full shadow-sm border border-gray-50 flex items-center justify-center mb-5">
                  <Plus size={24} className="text-[#949ba6]" />
                </div>
                <h3 className="text-[28px] md:text-[32px] font-luxury-serif mb-3 tracking-tight">
                  There are no photos yet
                </h3>
                <p className="text-[#8e94a0] text-sm mb-6">
                  Add new images to start restyling your project
                </p>
                <button
                  onClick={() => router.push(`/projects/${projectId}/upload`)}
                  className="bg-[#2d2d2d] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5"
                >
                  Add First Photo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 sticky top-26 h-[calc(100vh-128px)] min-h-150 pb-6">
          <SidebarOptions 
            selectedCount={selectedImages.length} 
            onRestyle={handleRestyle}
            isRestyling={isRestyling}
          />
        </div>
      </main>
    </div>
  );
}