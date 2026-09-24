"use client";

import type { ChangeEvent } from "react";

import { cn } from "@/lib/utils/cn";

interface PriceRangeFilterProps {
  min: string;
  max: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

const inputClassName = cn(
  "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400",
  "hover:border-slate-300 focus:bg-white",
  "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none",
);

export const PriceRangeFilter = ({
  min,
  max,
  onMinChange,
  onMaxChange,
}: PriceRangeFilterProps) => {
  const handle =
    (onChange: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (value === "" || /^\d*\.?\d*$/.test(value)) onChange(value);
    };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        inputMode="decimal"
        placeholder="Min"
        value={min}
        onChange={handle(onMinChange)}
        aria-label="Minimum price"
        className={inputClassName}
      />
      <span aria-hidden="true" className="text-sm text-slate-400">
        –
      </span>
      <input
        type="text"
        inputMode="decimal"
        placeholder="Max"
        value={max}
        onChange={handle(onMaxChange)}
        aria-label="Maximum price"
        className={inputClassName}
      />
    </div>
  );
};
