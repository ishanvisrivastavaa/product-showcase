import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Button } from "./button";

interface RadioGroupProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export const RadioGroup = ({ label, children, className }: RadioGroupProps) => (
  <div role="radiogroup" aria-label={label} className={className}>
    {children}
  </div>
);

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export const RadioOption = ({
  label,
  selected,
  onSelect,
}: RadioOptionProps) => (
  <Button
    variant="ghost"
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={cn(
      "group w-full justify-start gap-3 px-3 py-2.5 text-left text-sm font-normal",
      selected
        ? "bg-indigo-50 font-semibold text-indigo-700 hover:bg-indigo-50"
        : "text-slate-600",
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        selected
          ? "border-indigo-600"
          : "border-slate-300 group-hover:border-slate-400",
      )}
    >
      {selected ? (
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
      ) : null}
    </span>
    <span className="truncate">{label}</span>
  </Button>
);
