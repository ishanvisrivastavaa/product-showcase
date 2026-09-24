import { cn } from "@/lib/utils/cn";

import { StarIcon } from "@/components/ui/icons";

interface ProductRatingProps {
  rating: number;
  reviewCount?: number;
  className?: string;
}

export const ProductRating = ({
  rating,
  reviewCount,
  className,
}: ProductRatingProps) => (
  <div className={cn("flex items-center gap-1.5", className)}>
    <span className="sr-only">Rating: {rating.toFixed(1)} out of 5</span>
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "h-3.5 w-3.5",
            index < Math.round(rating) ? "text-amber-400" : "text-slate-200",
          )}
        />
      ))}
    </span>
    <span className="text-xs font-semibold text-slate-700" aria-hidden="true">
      {rating.toFixed(1)}
    </span>
    {typeof reviewCount === "number" ? (
      <span className="text-xs text-slate-400" aria-hidden="true">
        ({reviewCount})
      </span>
    ) : null}
  </div>
);
