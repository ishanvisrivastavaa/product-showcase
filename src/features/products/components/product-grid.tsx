import type { ReactNode } from "react";

import { QueryState } from "@/components/query/query-state";
import { QueryEmpty } from "@/components/query/query-empty";
import { QueryError } from "@/components/query/query-error";
import type { Product } from "@/features/products/types/product.types";

import { ProductCard } from "./product-card";
import {
  PRODUCT_GRID_CLASSES,
  ProductGridSkeleton,
} from "./product-card-skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  onRetry?: () => void;
}

export const ProductGrid = ({
  products,
  isLoading,
  isError,
  errorMessage,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onRetry,
}: ProductGridProps) => (
  <QueryState
    isLoading={isLoading}
    isError={isError}
    isEmpty={products.length === 0}
    loadingFallback={<ProductGridSkeleton />}
    errorFallback={
      <QueryError
        title="Failed to load products"
        message={errorMessage}
        onRetry={onRetry}
      />
    }
    emptyFallback={
      <QueryEmpty
        title={emptyTitle ?? "No products found"}
        description={emptyDescription}
        action={emptyAction}
      />
    }
  >
    <ul className={PRODUCT_GRID_CLASSES}>
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  </QueryState>
);
