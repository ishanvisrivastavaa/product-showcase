import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  GetProductsByCategoryParams,
  GetProductsParams,
  Product,
  ProductCategory,
  ProductsResponse,
  SearchProductsParams,
} from "@/features/products/types/product.types";

export const getProducts = async (
  params?: GetProductsParams,
): Promise<ProductsResponse> => {
  return apiClient.get<ProductsResponse>(endpoints.products.list, {
    params,
    unwrapResponse: false,
  });
};

export const getProduct = async (id: string): Promise<Product> => {
  return apiClient.get<Product>(endpoints.products.detail(id), {
    unwrapResponse: false,
  });
};

export const searchProducts = async (
  params: SearchProductsParams,
): Promise<ProductsResponse> => {
  return apiClient.get<ProductsResponse>(endpoints.products.search, {
    params,
    unwrapResponse: false,
  });
};

export const getProductCategories = async (): Promise<ProductCategory[]> => {
  return apiClient.get<ProductCategory[]>(endpoints.products.categories, {
    unwrapResponse: false,
  });
};

export const getProductsByCategory = async (
  params: GetProductsByCategoryParams,
): Promise<ProductsResponse> => {
  return apiClient.get<ProductsResponse>(
    endpoints.products.byCategory(params.category),
    {
      params: {
        skip: params.skip,
        limit: params.limit,
        sortBy: params.sortBy,
        order: params.order,
      },
      unwrapResponse: false,
    },
  );
};
