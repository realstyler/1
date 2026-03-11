"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (data: { name: string; address: string }) => void;
  beforeImage: string;
  afterImage: string;
  isSubmitting?: boolean;
}

export default function SaveToProjectModal({
  isOpen,
  onCancel,
  onSubmit,
  beforeImage,
  afterImage,
  isSubmitting = false,
}: Props) {
  const [projectName, setProjectName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) onCancel();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
      setProjectName("");
      setAddress("");
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onCancel, isSubmitting]);

  if (!isOpen) return null;

  const isFormValid = projectName.trim().length > 0 && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit({ name: projectName, address });
    }
  };

  return (
    <section
      className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md flex items-center justify-center p-4"
      onClick={!isSubmitting ? onCancel : undefined}
    >
      <div
        className="bg-white w-full max-w-115 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          disabled={isSubmitting}
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10 disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </button>

        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          <div className="flex gap-2 mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm relative">
              <Image 
                src={beforeImage} 
                alt="Original" 
                width={64}
                height={64}
                unoptimized={beforeImage.startsWith('blob:')}
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[8px] uppercase tracking-wider py-0.5">Original</div>
            </div>
            <div className="flex items-center text-gray-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#8ea28d] shadow-sm relative">
              <Image 
                src={afterImage} 
                alt="Restyled" 
                width={64}
                height={64}
                unoptimized={afterImage.startsWith('blob:')}
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-0 inset-x-0 bg-[#8ea28d]/90 text-white text-[8px] uppercase tracking-wider py-0.5">Styled</div>
            </div>
          </div>

          <h2 className="text-[28px] font-luxury-serif leading-tight mb-3 tracking-tight">
            Save to a new project
          </h2>
          <p className="text-sm text-[#8e94a0] mb-8 max-w-75 leading-relaxed font-sans">
            Create a workspace to save this result and continue styling your property.
          </p>

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
                disabled={isSubmitting}
                autoFocus
                className="w-full border-b border-gray-200 py-2 text-lg placeholder:text-gray-200 placeholder:font-serif outline-none focus:border-black transition-colors font-medium bg-transparent disabled:opacity-50"
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
                disabled={isSubmitting}
                className="w-full border-b border-gray-200 py-2 text-lg placeholder:text-gray-200 placeholder:font-serif outline-none focus:border-black transition-colors font-medium bg-transparent disabled:opacity-50"
              />
            </div>

            <div className="w-full mt-10 flex flex-col gap-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-lg active:scale-[0.98] ${
                  isFormValid
                    ? "bg-[#2d2d2d] text-white hover:bg-[#3d3d3d]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-400 border-t-white animate-spin" />
                ) : (
                  <>
                    Create & Save
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="py-1 text-[#8e94a0] font-bold text-sm hover:text-black transition-colors disabled:opacity-50"
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