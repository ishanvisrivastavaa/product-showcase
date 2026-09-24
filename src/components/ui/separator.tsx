import { cn } from "@/lib/utils/cn";

interface SeparatorProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export const Separator = ({
  className,
  orientation = "horizontal",
}: SeparatorProps) => (
  <div
    role="separator"
    aria-orientation={orientation}
    className={cn(
      orientation === "horizontal" ? "h-px w-full bg-slate-200" : "h-full w-px bg-slate-200",
      className,
    )}
  />
);
