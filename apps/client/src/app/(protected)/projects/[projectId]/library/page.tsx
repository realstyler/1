"use client"

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { useGetProject } from '@/projects/projects.hooks';
import { useCreateCollection } from '@/collections/collections.hooks'; 
import CollectionBuilder, { SelectedImageItem } from '@/components/library/CollectionBuilder';

export default function LibraryPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { data: project, isLoading } = useGetProject(projectId, true);
  const createCollectionMutation = useCreateCollection();

  const [selectedItems, setSelectedItems] = useState<SelectedImageItem[]>([]);
  const [collectionName, setCollectionName] = useState('');

  const toggleImageSelection = (item: SelectedImageItem) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const handleCreateCollection = async () => {
    if (!collectionName.trim() || selectedItems.length === 0) return;

    try {
      const itemsPayload = selectedItems.map((item, index) => ({
        originalImageId: item.originalImageId,
        styledImageId: item.styledImageId,
        orderIndex: index,
      }));

      const newCollection = await createCollectionMutation.mutateAsync({
        projectId,
        data: {
          name: collectionName,
          items: itemsPayload,
        },
      });

      if (newCollection?.id) {
        router.push(`/projects/${projectId}/collections/${newCollection.id}`);
      }
      
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#f8f8f7] h-screen flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-[#2d2d2d] animate-spin mb-4" />
        <p className="text-[10px] font-black text-[#8e94a0] uppercase tracking-[0.15em]">
          Loading library...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-[#f8f8f7] h-screen flex items-center justify-center font-luxury-serif text-2xl">
        Project not found
      </div>
    );
  }

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

      <div className="max-w-400 mx-auto px-6 py-8 flex gap-10 items-start">
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-6 mb-8 pl-2">
            <button
              onClick={() => router.push(`/projects/${projectId}`)}
              className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={1.5} className="text-[#1a1a1a]" />
            </button>
            <div>
              <h1 className="text-[32px] font-luxury-serif text-[#1a1a1a] mb-1.5 leading-none tracking-tight">
                Select Photos
              </h1>
              <p className="text-[#8e94a0] font-medium text-[13px]">
                Choose the original and restyled photos you want to include in a collection for {project.name}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 pb-20">
            {project.originalImages?.map((origGroup) => {
              if (!origGroup.originalUrl) return null;

              return (
                <div 
                  key={origGroup.id} 
                  className="bg-white border border-gray-100 rounded-3xl p-6 w-full shadow-sm"
                >
                  <div className="flex gap-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
                    
                    <div 
                      onClick={() => toggleImageSelection({
                        id: origGroup.id,
                        originalImageId: origGroup.id,
                        url: origGroup.originalUrl!,
                        label: 'Original'
                      })}
                      className="relative w-70 h-50 shrink-0 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group"
                    >
                      <Image 
                        src={origGroup.originalUrl} 
                        alt="Original"
                        fill
                        sizes="280px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white/95 text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-sm uppercase">
                        Original
                      </div>

                      <div
                        className={`absolute top-4 left-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedItems.some(i => i.id === origGroup.id)
                            ? "bg-[#8ea28d] border-[#8ea28d]"
                            : "bg-white/80 backdrop-blur-sm border-white shadow-sm"
                        }`}
                      >
                        {selectedItems.some(i => i.id === origGroup.id) && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {origGroup.styledImages && origGroup.styledImages.length > 0 && (
                      <div className="w-px shrink-0 my-4 mx-2 bg-linear-to-b from-transparent via-gray-200 to-transparent"></div>
                    )}

                    {origGroup.styledImages?.map((styled) => {
                      if (!styled.restyledUrl) return null;
                      
                      const isSelected = selectedItems.some(i => i.id === styled.id);

                      return (
                        <div 
                          key={styled.id}
                          onClick={() => toggleImageSelection({
                            id: styled.id,
                            styledImageId: styled.id,
                            originalImageId: origGroup.id,
                            url: styled.restyledUrl!,
                            label: styled.aesthetic || 'Restyled'
                          })}
                          className={`relative w-70 h-50 shrink-0 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer group border-2 transition-all ${
                            isSelected ? "border-[#8ea28d]" : "border-transparent hover:border-gray-200"
                          }`}
                        >
                          <Image 
                            src={styled.restyledUrl} 
                            alt={styled.aesthetic || 'Restyled'} 
                            fill
                            sizes="280px"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#1a1a1a] text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider shadow-sm uppercase">
                            {styled.aesthetic || 'Restyled'}
                          </div>

                          <div
                            className={`absolute top-4 left-4 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-[#8ea28d] border-[#8ea28d]"
                                : "bg-white/80 backdrop-blur-sm border-white shadow-sm"
                            }`}
                          >
                            {isSelected && (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {(!project.originalImages || project.originalImages.length === 0) && (
              <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center">
                <p className="text-[#8e94a0]">No images available in this project to create a collection.</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-85 shrink-0 sticky top-8 h-[calc(100vh-9rem)]">
          <CollectionBuilder 
            selectedItems={selectedItems}
            collectionName={collectionName}
            setCollectionName={setCollectionName}
            isCreating={createCollectionMutation.isPending}
            onCreate={handleCreateCollection}
            onClearSelection={clearSelection}
            onRemoveItem={toggleImageSelection}
          />
        </div>

      </div>
    </div>
  );
}