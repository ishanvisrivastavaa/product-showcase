import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export const Tooltip = ({ label, children, className }: TooltipProps) => (
  <span className={cn("group/tooltip relative inline-flex", className)}>
    {children}
    <span
      role="tooltip"
      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-150 group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100"
    >
      {label}
    </span>
  </span>
);
