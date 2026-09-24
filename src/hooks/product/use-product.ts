import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

import { ApiError } from "@/lib/api/errors";
import { queryKeys } from "@/lib/query/query-keys";
import {
  getProduct,
  getProductCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services";
import type {
  GetProductsByCategoryParams,
  GetProductsParams,
  Product,
  ProductCategory,
  ProductsResponse,
  SearchProductsParams,
} from "@/features/products/types/product.types";

type QueryOptions<T> = Omit<
  UseQueryOptions<T, ApiError>,
  "queryKey" | "queryFn"
>;

export const useProducts = (
  params?: GetProductsParams,
  options?: QueryOptions<ProductsResponse>,
) => {
  return useQuery<ProductsResponse, ApiError>({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getProducts(params),
    ...options,
  });
};

export const useProductDetail = (
  id: string,
  options?: QueryOptions<Product>,
) => {
  return useQuery<Product, ApiError>({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => getProduct(id),
    enabled: id.length > 0,
    ...options,
  });
};

export const useSearchProducts = (
  query: string,
  params?: Omit<SearchProductsParams, "q">,
  options?: QueryOptions<ProductsResponse>,
) => {
  return useQuery<ProductsResponse, ApiError>({
    queryKey: queryKeys.products.search(query, params),
    queryFn: () => searchProducts({ q: query, ...params }),
    enabled: query.trim().length > 0,
    ...options,
  });
};

export const useProductCategory = (
  options?: QueryOptions<ProductCategory[]>,
) => {
  return useQuery<ProductCategory[], ApiError>({
    queryKey: queryKeys.products.categories,
    queryFn: getProductCategories,
    ...options,
  });
};

export const useProductsByCategory = (
  category: string,
  params?: Omit<GetProductsByCategoryParams, "category">,
  options?: QueryOptions<ProductsResponse>,
) => {
  return useQuery<ProductsResponse, ApiError>({
    queryKey: queryKeys.products.byCategory(category, params),
    queryFn: () => getProductsByCategory({ category, ...params }),
    enabled: category.length > 0,
    ...options,
  });
};
