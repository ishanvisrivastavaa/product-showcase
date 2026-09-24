import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ProductCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="flex flex-col gap-3 p-5">
      <Skeleton className="h-3 w-1/4" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-3 w-1/3" />
      <div className="mt-2 flex items-end justify-between border-t border-slate-100 pt-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  </Card>
);

export const PRODUCT_GRID_CLASSES =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3";

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className={PRODUCT_GRID_CLASSES}>
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);
