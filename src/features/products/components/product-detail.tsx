"use client";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { QueryError } from "@/components/query/query-error";
import { formatSlug } from "@/lib/format/text";
import { useProductCategory, useProductDetail } from "@/hooks";

import { ProductDetailSkeleton } from "./product-detail-skeleton";
import { ProductGallery } from "./product-gallery";
import { ProductHighlights } from "./product-highlights";
import { ProductPriceCard } from "./product-price-card";
import { ProductSummary } from "./product-summary";
import { ProductTabs } from "./product-tabs";

interface ProductDetailProps {
  id: string;
}

export const ProductDetail = ({ id }: ProductDetailProps) => {
  const { data: product, isPending, isError, refetch } = useProductDetail(id);
  const { data: categories } = useProductCategory();

  if (isError) {
    return (
      <QueryError
        title="Failed to load product"
        message={`We could not load product #${id}.`}
        onRetry={refetch}
      />
    );
  }

  if (isPending || !product) {
    return <ProductDetailSkeleton />;
  }

  const categoryName =
    categories?.find((item) => item.slug === product.category)?.name ??
    formatSlug(product.category);
  const categoryHref = `/?category=${encodeURIComponent(product.category)}`;

  return (
    <article className="flex flex-col gap-8">
      <Breadcrumb
        items={[
          { label: "Products", href: "/" },
          { label: categoryName, href: categoryHref },
          { label: product.title },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery
            images={product.images}
            fallbackImage={product.thumbnail}
            title={product.title}
          />
        </div>

        <div className="flex flex-col gap-6">
          <ProductSummary product={product} categoryName={categoryName} />
          <ProductPriceCard
            product={product}
            categoryName={categoryName}
            categoryHref={categoryHref}
          />
          <ProductHighlights product={product} />
          <ProductTabs product={product} />
        </div>
      </div>
    </article>
  );
};
