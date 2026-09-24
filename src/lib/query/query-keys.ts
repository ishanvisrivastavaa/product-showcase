import type {
  GetProductsByCategoryParams,
  GetProductsParams,
  SearchProductsParams,
} from "@/features/products/types/product.types";

export const queryKeys = {
  products: {
    all: ["products"] as const,

    list: (params?: GetProductsParams) =>
      ["products", "list", params ?? {}] as const,

    detail: (id: string) => ["products", "detail", id] as const,

    search: (query: string, params?: Omit<SearchProductsParams, "q">) =>
      ["products", "search", query, params ?? {}] as const,

    categories: ["products", "categories"] as const,

    byCategory: (
      category: string,
      params?: Omit<GetProductsByCategoryParams, "category">,
    ) => ["products", "category", category, params ?? {}] as const,
  },
};
