"use client";

import { useMemo } from "react";

import {
  useProducts,
  useProductsByCategory,
  useSearchProducts,
} from "@/hooks";
import { PRODUCT_PAGE_SIZE } from "@/constants";
import type {
  GetProductsParams,
  Product,
} from "../types/product.types";
import type { ProductFilterState } from "../types/filter.types";

export interface UseProductListingParams {
  filters: ProductFilterState;
  requestParams: GetProductsParams;
}

export const useProductListing = ({
  filters,
  requestParams,
}: UseProductListingParams) => {
  const searchEnabled = filters.search.length > 0;
  const categoryEnabled = !searchEnabled && filters.category.length > 0;

  const searchQuery = useSearchProducts(filters.search, requestParams, {
    enabled: searchEnabled,
  });
  const categoryQuery = useProductsByCategory(filters.category, requestParams, {
    enabled: categoryEnabled,
  });
  const listQuery = useProducts(requestParams, {
    enabled: !searchEnabled && !categoryEnabled,
  });

  const activeQuery = searchEnabled
    ? searchQuery
    : categoryEnabled
      ? categoryQuery
      : listQuery;

  const products: Product[] = useMemo(
    () => activeQuery.data?.products ?? [],
    [activeQuery.data],
  );

  const total = activeQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE));

  return {
    activeQuery,
    products,
    total,
    totalPages,
    searchEnabled,
    categoryEnabled,
  };
};
