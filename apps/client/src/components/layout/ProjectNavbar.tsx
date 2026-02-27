"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Plus } from 'lucide-react';
import { AxiosError } from 'axios';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { useCreateProject } from '@/projects/projects.hooks';
import { useErrorToastStore } from "@/stores/useErrorToastStore";

export default function ProjectNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const isUploadPage = pathname?.includes('/upload');
  const isMainProjectsPage = pathname === '/projects' || pathname === '/projects/';
  const isDetailsPage = !isUploadPage && !isMainProjectsPage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mutate: createProject } = useCreateProject();
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
          show(errorMessage);
          console.error("Failed to create project:", error);
        }
      }
    );
  };

  return (
    <>
      <CreateProjectModal 
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      <header className="h-[80px] w-full bg-white flex items-center justify-between px-3 md:px-6 border-b border-gray-100 shrink-0 z-50 relative">
        <Link href="/" className="font-luxury-serif text-[22px] font-bold tracking-tight text-[#1a1a1a]">
          RealStyler
        </Link>
        
        <div className="flex items-center gap-5">

          {isDetailsPage && (
            <div className="flex items-center gap-2 px-3 md:px-6 py-1.5 border border-gray-200 rounded-full bg-white shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#d68a73]"></div>
              <span className="text-[12px] font-semibold text-[#5a5a5a]">34 Credits Remaining</span>
            </div>
          )}

          {!isUploadPage && (
              <button className="text-gray-400 hover:text-black transition-colors">
              <Bell size={22} strokeWidth={2} />
              </button>
          )}
          
          <button className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User avatar" 
              className="w-full h-full object-cover bg-indigo-100"
            />
          </button>

          {isUploadPage && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2d2d2d] text-white px-5 py-2.5 rounded-full flex items-center gap-2 ml-1 hover:bg-[#1a1a1a] transition-all active:scale-95 shadow-sm"
            >
              <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-white flex items-center justify-center">
                <Plus size={12} strokeWidth={2.5} color="white" />
              </div>
              <span className="text-[14px] font-medium tracking-wide">New Project</span>
            </button>
          )}

        </div>
      </header>
    </>
  );
}