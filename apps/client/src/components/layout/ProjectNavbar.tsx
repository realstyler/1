"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Plus, User } from 'lucide-react';
import { AxiosError } from 'axios';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { useCreateProject } from '@/projects/projects.hooks';
import { useErrorToastStore } from "@/stores/useErrorToastStore";
import { useAuthStore } from "@/auth/auth.store";

export default function ProjectNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  
  const isUploadPage = pathname?.includes('/upload');
  const isMainProjectsPage = pathname === '/projects' || pathname === '/projects/';
  const isLibraryPage = pathname?.includes('/library');
  const isDetailsPage = !isUploadPage && !isMainProjectsPage;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'collections'>('photos');
  
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
          sessionStorage.setItem(`isNewProject_${newProject.id}`, 'true');
          router.push(`/projects/${newProject.id}/upload`);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message: string }>;
          const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
          show(errorMessage);
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

      <header className="h-20 w-full bg-white flex items-center justify-between px-3 md:px-6 border-b border-gray-100 shrink-0 z-50 relative">
        <div className="flex items-center gap-8 md:gap-10">
          <Link href="/" className="font-luxury-serif text-[22px] font-bold tracking-tight text-[#1a1a1a]">
            RealStyler
          </Link>
          
          {isLibraryPage && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-1 text-[14px] font-medium rounded-full transition-all duration-200 border-2 ${
                  activeTab === 'photos' 
                    ? 'border-[#ebebeb] text-[#1a1a1a]' 
                    : 'border-transparent text-[#7a7a7a] hover:text-[#1a1a1a]'
                }`}
              >
                Photos
              </button>
              <button 
                onClick={() => setActiveTab('collections')}
                className={`px-4 py-1 text-[14px] font-medium rounded-full transition-all duration-200 border-2 ${
                  activeTab === 'collections' 
                    ? 'border-[#ebebeb] text-[#1a1a1a]' 
                    : 'border-transparent text-[#7a7a7a] hover:text-[#1a1a1a]'
                }`}
              >
                Collections
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-5">
          {isDetailsPage && (
            <div className="flex items-center gap-2 px-2 md:px-4 py-1.5 border border-gray-200 rounded-full bg-white shadow-sm">
              <div className={`w-2 h-2 rounded-full ${isLibraryPage ? 'bg-[#0fba81]' : 'bg-[#d68a73]'}`}></div>
              <span className="text-[12px] font-medium text-[#5a5a5a]">
                {isLibraryPage ? 'System Ready' : `${user?.creditsRemaining || 0} Credits Remaining`}
              </span>
            </div>
          )}

          {!isUploadPage && (
              <button className="text-gray-400 hover:text-black transition-colors">
                <Bell size={22} strokeWidth={2} />
              </button>
          )}
          
          <Link 
            href="/dashboard"
            className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 hover:shadow-md transition-shadow flex items-center justify-center bg-black text-white"
          >
            {user?.avatarUrl ? (
              <Image 
                src={user.avatarUrl} 
                alt="User avatar" 
                width={36}
                height={36}
                unoptimized={true}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-serif">{user?.name?.charAt(0).toUpperCase() || <User size={16} />}</span>
            )}
          </Link>

          {isUploadPage && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2d2d2d] text-white px-5 py-2.5 rounded-full flex items-center gap-2 ml-1 hover:bg-[#1a1a1a] transition-all active:scale-95 shadow-sm"
            >
              <div className="w-4.5 h-4.5 rounded-full border-[1.5px] border-white flex items-center justify-center">
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