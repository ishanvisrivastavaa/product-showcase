import dynamic from "next/dynamic";

import { ProductDetailSkeleton } from "@/features/products/components/product-detail-skeleton";

const ProductDetail = dynamic(
  () => import("@/features/products").then((mod) => mod.ProductDetail),
  {
    loading: () => <ProductDetailSkeleton />,
  },
);

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetail id={id} />
    </div>
  );
};

export default ProductPage;
