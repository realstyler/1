"use client";

import React, { useState, useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (data: { name: string; address: string }) => void;
}

export default function CreateProjectModal({
  isOpen,
  onCancel,
  onSubmit,
}: Props) {
  const [projectName, setProjectName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isFormValid = projectName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit({ name: projectName, address });
    }
  };

  return (
    <section 
      className="fixed inset-0 z-40 bg-white/60 backdrop-blur-md flex items-center justify-center p-4 pt-20"
      onClick={onCancel}
    >
      <div 
        className="bg-white w-full max-w-115 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close "X" button */}
        <button 
          onClick={onCancel}
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </button>

        {/* Content Section */}
        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          {/* Folder Icon */}
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#949ba6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          <h2 className="text-[32px] font-luxury-serif leading-tight mb-3 tracking-tight">
            Start a new project
          </h2>
          <p className="text-base text-[#8e94a0] mb-8 max-w-75 leading-relaxed font-sans">
            Enter the details below to begin transforming your property listing.
          </p>

          {/* Data Input Form */}
          <form onSubmit={handleSubmit} className="w-full text-left space-y-6">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#b1b5bd] mb-2">
                Project Name
              </label>
              <input
                type="text"
                placeholder="e.g. The Highland Loft"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                autoFocus
                className="w-full border-b border-gray-200 py-2 text-lg placeholder:text-gray-200 placeholder:font-serif outline-none focus:border-black transition-colors font-medium bg-transparent"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#b1b5bd] mb-2">
                Property Address <span className="text-[#d1d3d8] normal-case font-medium tracking-normal ml-1">Optional</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1284 Highland Ave"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border-b border-gray-200 py-2 text-lg placeholder:text-gray-200 placeholder:font-serif outline-none focus:border-black transition-colors font-medium bg-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full mt-10 flex flex-col gap-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-lg active:scale-[0.98] ${
                  isFormValid
                    ? "bg-[#2d2d2d] text-white hover:bg-black"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Create Project
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={onCancel}
                className="py-1 text-[#8e94a0] font-bold text-sm hover:text-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}