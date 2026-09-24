import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  "neutral" | "primary" | "success" | "warning" | "danger" | "outline";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-slate-100 text-slate-700",
  primary: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/10",
  success:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10",
  danger: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10",
  outline: "border border-slate-300 text-slate-600",
};

export const Badge = ({
  variant = "neutral",
  className,
  children,
}: BadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
      variantClasses[variant],
      className,
    )}
  >
    {children}
  </span>
);
