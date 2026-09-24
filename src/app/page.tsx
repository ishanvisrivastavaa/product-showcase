import { Suspense } from "react";
import type { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductList } from "@/features/products";
import { ProductListSkeleton } from "@/features/products/components/product-list-skeleton";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { getProductCategories, getProducts } from "@/services";

export const metadata: Metadata = {
  title: "Product Showcase | Browse Catalog",
  description:
    "Explore our collection of premium products across multiple categories with instant search and filtering.",
};

const HomePage = async () => {
  const queryClient = getQueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.categories,
      queryFn: getProductCategories,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.list(),
      queryFn: () => getProducts(),
    }),
  ]);

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default HomePage;
