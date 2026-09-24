"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { create } from "zustand";

import { Button } from "./button";
import { CheckIcon, XIcon } from "./icons";

interface Toast {
  id: number;
  message: string;
  link?: { href: string; label: string };
}

interface ToastState {
  toast: Toast | null;
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: () => void;
}

export const useToast = create<ToastState>((set) => ({
  toast: null,
  showToast: (toast) => set({ toast: { ...toast, id: Date.now() } }),
  hideToast: () => set({ toast: null }),
}));

export const Toaster = () => {
  const { toast, hideToast } = useToast();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!toast || isPaused) return;
    const timer = setTimeout(hideToast, 3000);
    return () => clearTimeout(timer);
  }, [toast, isPaused, hideToast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6 sm:justify-end sm:px-6">
      {toast ? (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 py-3 pr-2 pl-4 text-sm text-white shadow-xl"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <p className="min-w-0 flex-1 truncate">{toast.message}</p>
          {toast.link ? (
            <Link
              href={toast.link.href}
              onClick={hideToast}
              className="shrink-0 rounded font-semibold text-indigo-300 hover:text-indigo-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
            >
              {toast.link.label}
            </Link>
          ) : null}
          <Button
            variant="ghost"
            size="icon"
            onClick={hideToast}
            aria-label="Dismiss notification"
            className="h-7 w-7 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
};
