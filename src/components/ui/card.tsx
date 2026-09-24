import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Card = ({ className, children, ...props }: CardProps) => (
  <div
    className={cn(
      "rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-900/[0.03]",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);
