import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "@/features/products/types/product.types";

import { ProductRating } from "./product-rating";

interface ProductSummaryProps {
  product: Product;
  categoryName: string;
}

export const ProductSummary = ({
  product,
  categoryName,
}: ProductSummaryProps) => (
  <Card className="flex flex-col gap-3 p-6">
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="primary">{categoryName}</Badge>
      {product.brand ? <Badge variant="neutral">{product.brand}</Badge> : null}
    </div>
    <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
      {product.title}
    </h1>
    <ProductRating
      rating={product.rating}
      reviewCount={product.reviews.length}
    />
  </Card>
);
