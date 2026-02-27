"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockProjects } from '@/data/mock';
import { type Project } from '@/types';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { useCreateProject } from '@/projects/projects.hooks';
import { useErrorToastStore } from "@/stores/useErrorToastStore";
import { AxiosError } from "axios";
import { 
  Plus, 
  Filter, 
  ArrowUpDown, 
  Image as LucideImage, 
  Clock 
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { mutate: createProject } = useCreateProject();
  
  const itemsPerPage = 12;
  const currentItems = mockProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(mockProjects.length / itemsPerPage);

  const { show } = useErrorToastStore();

  const handleCreateProject = (data: { name: string; address: string }) => {
    createProject(
      { 
        name: data.name, 
        address: data.address || undefined 
      },
      {
        onSuccess: (newProject) => {
          setIsModalOpen(false);
          router.push(`/projects/${newProject.id}/upload?new=true`);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message: string }>;
          const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
          show(errorMessage)
          console.error("Failed to create project:", error);
        }
      }
    );
  };

  return (
    <div className="bg-[#f8f8f7] min-h-screen px-4 md:px-12 py-10 text-[#1a1a1a]">
      <CreateProjectModal 
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <div className="text-center mt-10 mb-16">
        <h1 className="text-[72px] font-luxury-serif mb-6 tracking-tight leading-none">
          Projects
        </h1>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2d2d2d] text-white px-6 py-2.5 rounded-full flex items-center gap-2 mx-auto hover:bg-[#3d3d3d] transition-all active:scale-95 shadow-md group"
        >
            <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                <Plus size={12} strokeWidth={3} color="white" />
            </div>
            <span className="text-[14px] font-[500]">New Project</span>
        </button>
      </div>

      <div className="flex justify-between items-end mb-10">
        <h2 className="text-[26px] font-serif tracking-tighter">Recent Projects</h2>
        <div className="flex gap-3">
            <button className="border border-gray-100 px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-slate-600 bg-white shadow-sm hover:bg-gray-50 transition-all">
                <Filter size={18} strokeWidth={1.5} />
                Filter
            </button>
            <button className="border border-gray-100 px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-slate-600 bg-white shadow-sm hover:bg-gray-50 transition-all">
                <ArrowUpDown size={18} strokeWidth={1.5} />
                Sort by: Date
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {currentItems.map((project: Project) => (
          <div 
            key={project.id} 
            className="group cursor-pointer"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            <div className="relative aspect-[1.38/1] mb-5 overflow-hidden rounded-[12px] bg-gray-100 shadow-sm border border-gray-50">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="object-cover w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
              />
              
              <div className={`absolute top-2.5 right-3 px-3 py-1.5 font-semibold rounded-full text-[10px] tracking-wider shadow-sm ${
                project.status === 'Processing' ? 'bg-[#e17a5f] text-white' : 
                project.status === 'Draft' ? 'bg-white/95 text-[#666]' : 
                'bg-white/95 backdrop-blur-md text-[#aeaeae]'
              }`}>
                {project.status}
              </div>

              <button 
                className="absolute bottom-2.5 right-3 bg-white/90 backdrop-blur-xl p-2.5 rounded-full text-gray-400 hover:text-[#1a1a1a] transition-all opacity-0 group-hover:opacity-100 border border-white/50 shadow-md hover:scale-105 animate-in fade-in"
                onClick={(e) => {
                  e.stopPropagation(); // Зупиняємо спливання події, якщо пізніше ви захочете додати інший функціонал для кнопки Edit
                  router.push(`/projects/${project.id}`);
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  <path d="m15 5 4 4"/>
                </svg>
              </button>
            </div>

            <h3 className="text-[18px] font-luxury-serif font-bold mb-1 tracking-tight group-hover:text-black/70 transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-[#8e94a0] text-[14px] mb-4 font-normal tracking-tight">
              {project.address}
            </p>
            
            <div className="w-full border-t border-[#f1f2f4] mb-3.5"></div>
            
            <div className="flex items-center gap-5 text-[#9ea4b0] font-normal text-[12px] tracking-tight">
              <span className="flex items-center gap-1.5">
                <LucideImage size={15} strokeWidth={1.5} color="#949ba6" />
                {project.imagesCount} images
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} strokeWidth={1.5} color="#949ba6" />
                Edited {project.updatedAt}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 flex justify-center gap-3">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentPage(i + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${
              currentPage === i + 1 
              ? 'bg-[#2d2d2d] text-white shadow-lg shadow-black/10' 
              : 'bg-white border border-gray-100 text-[#1a1a1a]/40 hover:border-gray-300 hover:text-[#1a1a1a]'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}