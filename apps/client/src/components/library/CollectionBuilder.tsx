"use client";

import React, { useState } from 'react';
import { 
  Folder, 
  ImagePlus, 
  ArrowRight, 
  Pencil,
  AlignJustify
} from 'lucide-react';

interface SelectedItem {
  id: number;
  title: string;
  subtitle: string;
  src: string;
}

interface CollectionBuilderProps {
  selectedItems?: SelectedItem[];
  onClearSelection: () => void;
}

export default function CollectionBuilder({ 
  selectedItems = [], 
  onClearSelection 
}: CollectionBuilderProps) {
  const [collectionName, setCollectionName] = useState('');

  return (
    <aside className="w-full h-full flex flex-col bg-white rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none z-20" />

      <div className="flex-1 overflow-y-auto p-7 pb-32 scrollbar-hide relative" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />
        
        <div className="flex items-center gap-2 text-[#a1a5ad] mb-4">
          <Folder size={14} strokeWidth={2} />
          <span className="text-[11px] font-[700] uppercase tracking-[0.15em]">
            Collection Builder
          </span>
        </div>

        <h2 className="text-[28px] font-serif leading-tight text-gray-900 mb-3">
          Create New<br />Collection
        </h2>
        
        <p className="text-[13px] leading-relaxed text-[#5a5f66] mb-4">
          Group selected variations into a single, shareable presentation page for your client.
        </p>

        <div className="bg-[#f7f8f7] rounded-[24px] p-5 mb-8">
          <div className="w-full border-2 border-dashed border-[#d1d3d4] rounded-2xl py-8 flex flex-col items-center justify-center gap-3 mb-4 cursor-pointer hover:bg-white/50 transition-all">
            <ImagePlus size={24} strokeWidth={1.5} className="text-[#a1a5ad]" />
            <span className="text-[13px] font-medium text-[#8e94a0]">
              Drag photos to include
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-[11px] font-[800] uppercase tracking-[0.15em] text-gray-900">
                Selection
              </span>
              <span className="bg-[#8ea28d] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {selectedItems.length} Images
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-medium text-gray-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#a1a5ad] truncate">
                      {item.subtitle}
                    </p>
                  </div>
                  <button className="text-gray-300 hover:text-gray-500 transition-colors cursor-grab active:cursor-grabbing">
                    <AlignJustify size={16} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10">
          <label className="text-[11px] font-[800] uppercase tracking-[0.15em] text-[#a1a5ad] block mb-3">
            Collection Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Ocean Drive Concept"
              className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 transition-all peer"
            />
            <Pencil size={14} className="absolute right-4 text-gray-400 peer-focus:text-gray-800 transition-colors pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white 70% to-transparent pt-4 z-20 border-t border-gray-200/60 backdrop-blur-[2px]">
        <div className="flex flex-col gap-3">
          <button className="w-full py-3.5 rounded-full bg-[#1a1a1a] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#3d3d3d] transition-all active:scale-[0.98] shadow-lg shadow-black/5">
            Create
            <ArrowRight size={16} strokeWidth={2} />
          </button>
          
          <button 
            onClick={onClearSelection}
            className="w-full py-3.5 rounded-full bg-white border border-gray-200 text-[#5a5f66] font-medium text-[14px] hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-[0.98]"
          >
            Clear Selection
          </button>
        </div>
      </div>
      
    </aside>
  );
}