"use client";

import { create } from "zustand";

type ErrorToastState = {
  message: string | null;
  isVisible: boolean;
  show: (message: string) => void;
  hide: () => void;
};

export const useErrorToastStore = create<ErrorToastState>((set) => ({
  message: null,
  isVisible: false,

  show: (message: string) =>
    set({
      message,
      isVisible: true,
    }),

  hide: () =>
    set({
      message: null,
      isVisible: false,
    }),
}));