import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "neutral" | "danger";
  className?: string;
}

const iconClasses = {
  neutral: "bg-slate-100 text-slate-500",
  danger: "bg-rose-100 text-rose-600",
};

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  variant = "neutral",
  className,
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center",
      className,
    )}
  >
    <span
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-2xl",
        iconClasses[variant],
      )}
    >
      {icon}
    </span>
    <p className="text-lg font-semibold text-slate-900">{title}</p>
    {description ? (
      <p className="max-w-md text-sm text-slate-500">{description}</p>
    ) : null}
    {action ? <div className="mt-2">{action}</div> : null}
  </div>
);
