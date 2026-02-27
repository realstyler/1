"use client";

import React, { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProjectByIdApi } from '@/projects/projects.api';
import { mockStyles } from '@/data/mock';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  UploadCloud, 
  Trash2, 
  ChevronRight,
  Upload
} from 'lucide-react';

export default function ProjectUploadPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;

  const isNewProject = searchParams.get('new') === 'true';

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

          {/* Upload Area */}
          <div className="flex-1 min-h-[320px] border-2 border-dashed border-[#d1d7cb] hover:border-[#b5bcaf] rounded-[32px] flex flex-col items-center justify-center bg-white transition-all cursor-pointer group mb-6 relative shadow-sm">
            <div className="w-12 h-12 bg-[#f8f8f7] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <UploadCloud size={22} className="text-[#949ba6]" strokeWidth={1.5} />
            </div>

            <h2 className="text-[22px] md:text-[24px] font-luxury-serif mb-2 tracking-tight text-center">
              Drop your photos here
            </h2>
            
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-[#8e94a0] text-xs font-serif italic">or</span>
              <button className="bg-[#2d2d2d] text-white px-5 py-2 rounded-full font-bold text-[12px] hover:bg-black transition-all active:scale-95 shadow-md flex items-center gap-2">
                <Upload size={13} />
                Browse to upload
              </button>
            </div>

            <p className="text-[#b1b5bd] text-[9px] font-black uppercase tracking-[0.2em]">
              JPEG, PNG • UP TO 10 IMAGES
            </p>
          </div>

          {/* Image Preview List */}
          <div className="shrink-0 px-1 mb-4">
            <p className="text-[12px] font-bold text-[#87817c] mb-3">
              Uploaded <span className="text-[#d7d3d2]">{uploadedUrls.length}/10</span>
            </p>
            
            <div className="flex flex-row gap-4 overflow-x-auto pb-2 no-scrollbar min-h-[105px]">
                {uploadedUrls.map((url, index) => (
                  <div 
                    key={`${url}-${index}`} 
                    className="relative w-24 h-24 shrink-0 rounded-[18px] overflow-hidden border border-gray-200 shadow-sm group"
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
                      className="group/btn absolute top-2 right-2 w-7 h-7 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:scale-110"
                    >
                      <Trash2 size={13} className="text-[#949ba6] group-hover/btn:text-red-500 transition-colors duration-200" />
                    </button>
                  </div>
                ))}

                <div className="w-24 h-24 shrink-0 rounded-[18px] border border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin" />
                  <span className="text-[10px] font-bold text-gray-400">Processing</span>
                </div>
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
              onClick={() => router.push(`/projects/${projectId}`)}
              className="bg-black text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-black/20"
            >
              Done
            </button>
          )}
        </div>
      </main>
    </div>
  );
}