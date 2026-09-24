import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

import { SearchIcon } from "./icons";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export const SearchInput = ({ className, ...props }: SearchInputProps) => (
  <div className="relative">
    <SearchIcon
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
    />
    <input
      type="search"
      className={cn(
        "h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-3.5 pl-10 text-sm text-slate-900 transition-colors placeholder:text-slate-400",
        "hover:border-slate-300 focus:bg-white",
        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none",
        "[&::-webkit-search-cancel-button]:hidden",
        className,
      )}
      {...props}
    />
  </div>
);
