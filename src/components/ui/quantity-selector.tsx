import { cn } from "@/lib/utils/cn";

import { Button } from "./button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  label?: string;
  size?: "sm" | "md";
}

const stepClasses = "h-full rounded-none text-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900";

export const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max,
  label = "Quantity",
  size = "md",
}: QuantitySelectorProps) => (
  <div
    role="group"
    aria-label={label}
    className={cn(
      "inline-flex items-stretch overflow-hidden rounded-lg border border-slate-300 bg-white",
      size === "sm" ? "h-8" : "h-11",
    )}
  >
    <Button
      variant="ghost"
      onClick={() => onChange(value - 1)}
      disabled={value <= min}
      aria-label="Decrease quantity"
      className={cn(stepClasses, size === "sm" ? "w-8" : "w-11")}
    >
      −
    </Button>
    <output
      aria-live="polite"
      className={cn(
        "flex items-center justify-center border-x border-slate-200 font-semibold text-slate-900",
        size === "sm" ? "w-9 text-xs" : "w-12 text-sm",
      )}
    >
      {value}
    </output>
    <Button
      variant="ghost"
      onClick={() => onChange(value + 1)}
      disabled={value >= max}
      aria-label="Increase quantity"
      className={cn(stepClasses, size === "sm" ? "w-8" : "w-11")}
    >
      +
    </Button>
  </div>
);
