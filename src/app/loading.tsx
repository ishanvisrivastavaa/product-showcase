import { ProductListSkeleton } from "@/features/products/components/product-list-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <ProductListSkeleton />
    </div>
  );
}
