"use client";

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProjectByIdApi } from '@/projects/projects.api';
import { mockStyles } from '@/data/mock';

export default function ProjectUploadPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;

  const isNewProject = searchParams.get('new') === 'true';

  // Mock state for demonstration
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([
    mockStyles[0].thumbnail,
    mockStyles[1].thumbnail,
    mockStyles[2].thumbnail
  ]);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectByIdApi(projectId),
  });

  const handleDelete = (urlToDelete: string) => {
    setUploadedUrls(prev => prev.filter(url => url !== urlToDelete));
  };

  if (isLoading) return null;
  if (!project) return <div className="h-screen flex items-center justify-center font-luxury-serif text-2xl">Project not found</div>;

  return (
    <div className="bg-[#f8f8f7] h-[calc(100vh-80px)] text-[#1a1a1a] overflow-hidden">
      <main className="h-full max-w-[1200px] mx-auto px-6 py-8 flex flex-col">
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6 shrink-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.back()}
              className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 className="text-[30px] font-luxury-serif leading-tight tracking-tight">
                {project.name}
              </h1>
              <p className="text-[#8e94a0] font-semibold text-[12px] mt-0.5">
                {isNewProject ? "New Project" : "Add Images"}
              </p>
            </div>
          </div>

          <button className="text-gray-300 hover:text-gray-600 transition-colors pt-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" />
            </svg>
          </button>
        </div>

        {/* Upload Area */}
        <div className="flex-1 min-h-0 border-2 border-dashed border-gray-300 rounded-[32px] flex flex-col items-center justify-center bg-white transition-all cursor-pointer group mb-8 relative">
          <div className="w-14 h-14 bg-white rounded-full shadow-sm border border-gray-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#949ba6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <h2 className="text-[28px] md:text-[32px] font-luxury-serif mb-3 tracking-tight">Drop your photos here</h2>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#8e94a0] text-base font-serif italic">or</span>
            <button className="bg-[#2d2d2d] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-black transition-all active:scale-95 shadow-lg shadow-black/5">
              Browse to upload
            </button>
          </div>

          <p className="text-[#b1b5bd] text-[10px] font-black uppercase tracking-[0.2em]">
            JPEG, PNG • UP TO 10 IMAGES
          </p>
        </div>

        {/* Image Preview List */}
        <div className="shrink-0">
          <p className="text-[12px] font-semibold text-[#87817c] mb-4">
            Uploaded <span className="text-[#d7d3d2]">{uploadedUrls.length}/10</span>
          </p>
          
          <div className="flex flex-row gap-4 overflow-x-auto pb-4 no-scrollbar min-h-[120px]">
              {uploadedUrls.map((url, index) => (
                <div 
                  key={`${url}-${index}`} 
                  className="relative w-28 h-28 shrink-0 rounded-[20px] overflow-hidden border border-gray-300 shadow-sm group"
                >
                  <img 
                    src={url} 
                    alt={`Uploaded ${index}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(url);
                    }}
                    className="group/btn absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110"
                  >
                    <svg 
                      width="14" height="14" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" strokeWidth="2" 
                      strokeLinecap="round" strokeLinejoin="round"
                      className="text-[#949ba6] group-hover/btn:text-red-500 transition-colors duration-200"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Loader Placeholder */}
              <div 
                className="w-28 h-28 shrink-0 rounded-[20px] border border-gray-300 bg-gray-50/50 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
                <span className="text-[10px] font-semibold text-gray-400">Processing</span>
              </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="mt-auto pt-6 flex justify-end shrink-0">
          {isNewProject ? (
            <button 
              onClick={() => router.push(`/projects/${projectId}`)}
              className="text-[#8e94a0] font-bold text-sm hover:text-black transition-colors flex items-center gap-2 group"
            >
              Skip for now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={() => router.push(`/projects/${projectId}`)}
              className="bg-black text-white px-10 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95"
            >
              Done
            </button>
          )}
        </div>
      </main>
    </div>
  );
}