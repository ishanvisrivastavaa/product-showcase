export const endpoints = {
  products: {
    list: "/products",
    detail: (id: string) => `/products/${id}`,
    search: "/products/search",
    categories: "/products/categories",
    byCategory: (category: string) => `/products/category/${category}`,
  },
} as const;
