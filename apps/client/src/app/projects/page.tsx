"use client";

import React, { useState } from 'react';
import { mockProjects } from '@/data/mock';
import { type Project } from '@/types';

export default function ProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const currentItems = mockProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(mockProjects.length / itemsPerPage);

  return (
    <div className="bg-white min-h-screen px-4 md:px-12 py-10 text-[#1a1a1a]">
      <div className="text-center mt-10 mb-16">
        <h1 className="text-[72px] font-luxury-serif mb-6 tracking-tight leading-none">
          Projects
        </h1>
        
        <button className="bg-[#2d2d2d] text-white px-6 py-2.5 rounded-full flex items-center gap-2 mx-auto hover:bg-[#3d3d3d] transition-all active:scale-95 shadow-md group">
            <div className="w-5 h-5 rounded-full border border-white/100 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </div>
            <span className="text-[14px] font-[500]">New Project</span>
        </button>
      </div>

      <div className="flex justify-between items-end mb-10">
        <h2 className="text-[26px] tracking-tighter">Recent Projects</h2>
        <div className="flex gap-3">
            <button className="border border-gray-100 px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-slate-600 bg-white shadow-sm hover:bg-gray-50 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                </svg>
                Filter
            </button>
            <button className="border border-gray-100 px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium text-slate-600 bg-white shadow-sm hover:bg-gray-50 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 4v16M7 4l3 3M7 4L4 7m13-3v16m0 0l3-3m-3 3l-3-3"/>
                </svg>
                Sort by: Date
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {currentItems.map((project: Project) => (
          <div key={project.id} className="group cursor-pointer">
            <div className="relative aspect-[1.38/1] mb-6 overflow-hidden rounded-[12px] bg-gray-100 shadow-sm border border-gray-50">
              <img 
                src={project.imageUrl} 
                alt={project.title}
                className="object-cover w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-105"
              />
              
              <div className={`absolute top-2.5 right-3 px-3 py-1.5 font-semibold rounded-full text-[8px] uppercase tracking-wider shadow-sm ${
                project.status === 'Processing' ? 'bg-[#e17a5f] text-white' : 
                project.status === 'Draft' ? 'bg-white/95 text-[#666]' : 
                'bg-white/95 backdrop-blur-md text-[#aeaeae]'
              }`}>
                {project.status}
              </div>

              <button className="absolute bottom-2 right-3 bg-white/90 backdrop-blur-xl p-2 rounded-full text-gray-400 hover:bg-[#f5f5f5] hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100 border border-white/50 shadow-xl">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            <h3 className="text-[20px] font-luxury-serif font-bold mb-1 tracking-tight group-hover:text-black/70 transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-[#8e94a0] text-[16px] mb-6 font-normal tracking-tight">
              {project.address}
            </p>
            
            <div className="w-full border-t border-[#f1f2f4] mb-4"></div>
            
            <div className="flex items-center gap-6 text-[#9ea4b0] font-normal text-[14px] tracking-tight">
              <span className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#949ba6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
                {project.imagesCount} images
              </span>
              <span className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#949ba6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
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