"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  "aria-label": string;
}

export const Dialog = ({
  open,
  onClose,
  children,
  "aria-label": ariaLabel,
}: DialogProps) => {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto rounded-r-2xl bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "invisible -translate-x-full",
        )}
      >
        {children}
      </div>
    </>
  );
};
