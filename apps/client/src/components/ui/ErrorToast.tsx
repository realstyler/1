"use client";

import { useEffect } from "react";
import { useErrorToastStore } from "@/stores/useErrorToastStore";

export default function ErrorToast() {
  const { message, isVisible, hide } = useErrorToastStore();

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      hide();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isVisible, hide]);

  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }
      `}
    >
      <div className="mb-6 min-w-[320px] max-w-md bg-white border border-red-200 text-red-600 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-6">
          <p className="text-sm font-medium leading-relaxed">{message}</p>

          <button
            onClick={hide}
            className="text-red-400 hover:text-red-600 transition text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
