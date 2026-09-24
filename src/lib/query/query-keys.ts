import type {
  GetProductsByCategoryParams,
  GetProductsParams,
  SearchProductsParams,
} from "@/features/products/types/product.types";

const all = ["products"] as const;

export const queryKeys = {
  products: {
    all,

    list: (params?: GetProductsParams) =>
      [...all, "list", params ?? {}] as const,

    detail: (id: string) => [...all, "detail", id] as const,

    search: (query: string, params?: Omit<SearchProductsParams, "q">) =>
      [...all, "search", query, params ?? {}] as const,

    categories: [...all, "categories"] as const,

    byCategory: (
      category: string,
      params?: Omit<GetProductsByCategoryParams, "category">,
    ) => [...all, "category", category, params ?? {}] as const,
  },
};
