import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { ProductDetail } from "@/features/products";
import { ProductDetailSkeleton } from "@/features/products/components/product-detail-skeleton";
import { getQueryClient } from "@/lib/query/query-client";
import { queryKeys } from "@/lib/query/query-keys";
import { getProduct } from "@/services";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    return { title: "Product Not Found" };
  }

  try {
    const product = await getProduct(id);
    return {
      title: `${product.title} | Product Showcase`,
      description: product.description,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    notFound();
  }

  const queryClient = getQueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => getProduct(id),
    });
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail id={id} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default ProductPage;
