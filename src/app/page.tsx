import { Suspense } from "react";
import dynamic from "next/dynamic";

import { ProductListSkeleton } from "@/features/products/components/product-list-skeleton";

const ProductList = dynamic(
  () =>
    import("@/features/products").then((mod) => mod.ProductList),
  {
    loading: () => <ProductListSkeleton />,
  },
);

const HomePage = () => (
  <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  </div>
);

export default HomePage;
