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
      className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100"
    >
      {label}
    </span>
  </span>
);
