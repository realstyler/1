"use client"

import React, { useState } from 'react';
import { libraryProjects } from '@/data/mock';
import { Image } from 'lucide-react';
import CollectionBuilder from '@/components/library/CollectionBuilder';

export default function LibraryPage() {
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([]);

  const toggleProjectSelection = (id: number) => {
    setSelectedProjectIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((projectId) => projectId !== id);
      }
      return [...prev, id];
    });
  };

  const clearSelection = () => {
    setSelectedProjectIds([]);
  };

  const selectedProjectsData = libraryProjects
    .filter((project) => selectedProjectIds.includes(project.id))
    .map((project) => {
      const coverImage = project.images.find((img) => img.type !== 'more') || project.images[0];
      return {
        id: project.id,
        title: project.title,
        subtitle: project.subtitle,
        src: coverImage?.src || ''
      };
    });

  return (
    <div className="min-h-screen bg-transparent p-8 flex justify-center">
      <div className="w-full max-w-[1440px] flex gap-8 items-start">
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-serif text-gray-900 mb-2 leading-none">Library</h1>
              <p className="text-gray-400 text-[8]">Manage your original photos and restyled concepts</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <button className="bg-[#1A1A1A] hover:bg-[#3d3d3d] transition-colors text-white px-8 py-4 rounded-full flex items-center gap-2 font-medium text-base">
                Create Collection 
                <span className="text-xl leading-none">&rarr;</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 pb-20">
            {libraryProjects.map((project) => {
              const isSelected = selectedProjectIds.includes(project.id);
              
              return (
                <div 
                  key={project.id} 
                  onClick={() => toggleProjectSelection(project.id)}
                  className={`
                    bg-white border rounded-[24px] p-5 w-full cursor-pointer transition-all duration-200
                    ${isSelected ? 'border-[#8b9a7d] ring-1 ring-[#8b9a7d]' : 'border-gray-300'}
                  `}
                >
                  <div className="flex gap-4 overflow-x-auto mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {project.images.map((img, index) => (
                      <React.Fragment key={img.id}>
                        {img.type === 'more' ? (
                          <div className="w-[260px] h-[180px] shrink-0 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                            <Image className="mb-2 opacity-50" size={24} strokeWidth={2} />
                            <span className="text-sm font-medium">{img.label}</span>
                          </div>
                        ) : (
                          <div className="relative w-[260px] h-[180px] shrink-0 rounded-2xl overflow-hidden bg-gray-200">
                            <img 
                              src={img.src} 
                              alt={img.label || 'project'} 
                              className="w-full h-full object-cover"
                            />
                            
                            {img.type === 'original' && (
                              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white/95 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                                {img.label}
                              </div>
                            )}
                            
                            {img.type === 'variation' && (
                              <div className="absolute top-3 right-3 bg-white/70 backdrop-blur-md text-gray-900/95 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-sm">
                                {img.label}
                              </div>
                            )}
                          </div>
                        )}

                        {index === 0 && project.images.length > 1 && (
                          <div className="w-px shrink-0 my-3 mx-3 bg-gradient-to-b from-transparent via-gray-300 to-transparent opacity-60"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="px-1 mt-2">
                    <h3 className="text-lg text-gray-900 font-serif mb-1 lining-nums">{project.title}</h3>
                    <p className="text-xs text-gray-400 font-medium lining-nums">{project.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-[340px] shrink-0 sticky top-8 h-[calc(100vh-9rem)]">
          <CollectionBuilder 
            selectedItems={selectedProjectsData} 
            onClearSelection={clearSelection} 
          />
        </div>

      </div>
    </div>
  );
}