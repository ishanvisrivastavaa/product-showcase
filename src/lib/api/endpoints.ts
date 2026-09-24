export const endpoints = {
  products: {
    list: "/products",
    detail: (id: string) => `/products/${encodeURIComponent(id)}`,
    search: "/products/search",
    categories: "/products/categories",
    byCategory: (category: string) =>
      `/products/category/${encodeURIComponent(category)}`,
  },
} as const;
