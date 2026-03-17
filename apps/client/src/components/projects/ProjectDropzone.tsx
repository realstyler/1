"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud, Upload, AlertCircle } from 'lucide-react';

interface ProjectDropzoneProps {
  onFilesSelect: (files: File[]) => void;
  uploadedCount: number;
  maxFiles: number;
}

export default function ProjectDropzone({ onFilesSelect, uploadedCount, maxFiles }: ProjectDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelect(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelect(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isLimitReached = uploadedCount >= maxFiles;

  return (
    <>
      {/* Hidden Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        hidden 
        multiple 
        accept="image/jpeg, image/png, image/webp" 
        onChange={handleFileSelect} 
      />

      {/* Upload Area */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLimitReached && fileInputRef.current?.click()}
        className={`flex-1 min-h-80 border-2 border-dashed rounded-4xl flex flex-col items-center justify-center bg-white transition-all cursor-pointer group mb-6 relative shadow-sm ${
          isDragging && !isLimitReached ? 'border-[#8ea28d] bg-[#fdfefd] scale-[1.01]' : 'border-[#d1d7cb] hover:border-[#b5bcaf]'
        }`}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform duration-500 ${
          isDragging && !isLimitReached ? 'bg-[#8ea28d]/10 scale-110' : 'bg-[#f8f8f7] group-hover:scale-110'
        }`}>
          <UploadCloud size={22} className={isDragging && !isLimitReached ? 'text-[#8ea28d]' : 'text-[#949ba6]'} strokeWidth={1.5} />
        </div>

        <h2 className="text-[22px] md:text-[24px] font-luxury-serif mb-2 tracking-tight text-center text-[#1a1a1a]">
          Drop your photos here
        </h2>
        
        <div className="flex items-center gap-2.5 mb-5">
          <span className="text-[#8e94a0] text-xs font-serif italic">or</span>
          <button 
            type="button"
            className="bg-[#2d2d2d] text-white px-5 py-2 rounded-full font-bold text-[12px] hover:bg-black transition-all active:scale-95 shadow-md flex items-center gap-2"
          >
            <Upload size={13} />
            Browse to upload
          </button>
        </div>

        <p className="text-[#b1b5bd] text-[9px] font-black uppercase tracking-[0.2em] text-center px-4">
          JPEG, PNG, WEBP • MAX 10MB PER FILE • UP TO {maxFiles} IMAGES
        </p>

        {isLimitReached && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-4xl flex flex-col items-center justify-center z-10 cursor-not-allowed">
             <AlertCircle size={32} className="text-[#e17a5f] mb-3" strokeWidth={1.5} />
             <h3 className="font-luxury-serif text-xl tracking-tight text-[#1a1a1a]">Maximum limit reached</h3>
             <p className="text-sm text-[#8e94a0] mt-1">You can upload up to {maxFiles} images</p>
          </div>
        )}
      </div>
    </>
  );
}