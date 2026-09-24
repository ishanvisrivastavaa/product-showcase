import { Skeleton } from "@/components/ui/skeleton";

import { ProductGridSkeleton } from "./product-card-skeleton";

export const ProductListSkeleton = () => (
  <div className="flex flex-col gap-6">
    <Skeleton className="h-4 w-40" />
    <Skeleton className="h-32 w-full rounded-3xl sm:h-36" />
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
      <div className="hidden flex-col gap-5 lg:flex">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-9 w-full" />
        ))}
      </div>
      <ProductGridSkeleton />
    </div>
  </div>
);
