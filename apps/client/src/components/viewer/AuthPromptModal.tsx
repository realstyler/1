"use client";

import Link from "next/link";
import React, { useEffect } from "react";

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthPromptModal({
  isOpen,
  onClose,
}: AuthPromptModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <section
      className="fixed inset-0 z-50 bg-white/60 backdrop-blur-md flex items-center justify-center p-4 pt-[80px]"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[460px] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close "X" button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </button>

        {/* Content Section */}
        <div className="p-8 md:p-10 flex flex-col items-center text-center">
          {/* User/Auth Icon */}
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6 border border-gray-100">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#949ba6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h2 className="text-[32px] font-luxury-serif leading-tight mb-3 tracking-tight">
            Save Your Project
          </h2>
          <p className="text-base text-[#8e94a0] mb-10 max-w-[300px] leading-relaxed font-sans">
            Create an account or log in to save your transformed room and access
            it from any device.
          </p>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <Link
              href="/signup?redirect=/viewer"
              className="w-full py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition shadow-lg active:scale-[0.98] bg-[#2d2d2d] text-white hover:bg-black"
            >
              Create Account
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              href="/login?redirect=/viewer"
              className="w-full py-4 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 transition active:scale-[0.98] bg-gray-100 text-gray-900 hover:bg-gray-200"
            >
              Log In
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="mt-3 py-1 text-[#8e94a0] font-bold text-sm hover:text-black transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}