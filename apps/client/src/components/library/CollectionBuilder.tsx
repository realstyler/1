"use client";

import Image from 'next/image';
import { 
  Folder, 
  ArrowRight, 
  Pencil,
  X,
  Loader2
} from 'lucide-react';

export interface SelectedImageItem {
  id: string;
  originalImageId?: string;
  styledImageId?: string;
  url: string;
  label: string;
}

interface CollectionBuilderProps {
  selectedItems: SelectedImageItem[];
  collectionName: string;
  setCollectionName: (name: string) => void;
  isCreating: boolean;
  onCreate: () => void;
  onClearSelection: () => void;
  onRemoveItem: (item: SelectedImageItem) => void;
}

export default function CollectionBuilder({ 
  selectedItems, 
  collectionName,
  setCollectionName,
  isCreating,
  onCreate,
  onClearSelection,
  onRemoveItem
}: CollectionBuilderProps) {
  return (
    <aside className="w-full h-full flex flex-col bg-white rounded-4xl border border-gray-100 shadow-sm relative overflow-hidden">

      <div className="absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-white via-white/40 to-transparent pointer-events-none z-20" />

      <div className="flex-1 overflow-y-auto p-7 pb-40 scrollbar-hide relative" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}} />
        
        <div className="flex items-center gap-2 text-[#a1a5ad] mb-4">
          <Folder size={14} strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">
            Collection Builder
          </span>
        </div>

        <h2 className="text-[28px] font-serif leading-tight text-gray-900 mb-3">
          Create New<br />Collection
        </h2>
        
        <p className="text-[13px] leading-relaxed text-[#5a5f66] mb-4">
          Group selected variations into a single, shareable presentation page for your client.
        </p>

        <div className="bg-[#f7f8f7] rounded-3xl p-5 mb-8">
          <div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-900">
                Selection
              </span>
              <span className="bg-[#8ea28d] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                {selectedItems.length} Images
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                    <Image 
                      src={item.url} 
                      alt={item.label} 
                      width={40}
                      height={40}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider truncate">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-[#a1a5ad] truncate">
                      {item.originalImageId && !item.styledImageId ? 'Original File' : 'Restyled Concept'}
                    </p>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item)}
                    className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10">
          <label className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#a1a5ad] block mb-3">
            Collection Name
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g. Client Presentation"
              className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-[14px] font-medium text-gray-900 focus:outline-none focus:border-[#8ea28d] focus:ring-1 focus:ring-[#8ea28d] transition-all peer"
            />
            <Pencil size={14} className="absolute right-4 text-gray-400 peer-focus:text-[#8ea28d] transition-colors pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-white via-white 70% to-transparent pt-4 z-20 border-t border-gray-100 backdrop-blur-sm">
        <div className="flex flex-col gap-3">
          <button 
            onClick={onCreate}
            disabled={selectedItems.length === 0 || !collectionName.trim() || isCreating}
            className="w-full py-3.5 rounded-full bg-[#1a1a1a] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#3d3d3d] transition-all active:scale-[0.98] shadow-lg shadow-black/5 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
          >
            {isCreating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create
                <ArrowRight size={16} strokeWidth={2} />
              </>
            )}
          </button>
          
          <button 
            onClick={onClearSelection}
            disabled={selectedItems.length === 0 || isCreating}
            className="w-full py-3.5 rounded-full bg-white border border-gray-200 text-[#5a5f66] font-medium text-[14px] hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-white"
          >
            Clear Selection
          </button>
        </div>
      </div>
      
    </aside>
  );
}