import type { ProductSortOrder } from "@/features/products/types/product.types";

export interface SortOption {
  value: string;
  label: string;
  sortBy?: string;
  order?: ProductSortOrder;
}

export const DEFAULT_SORT = "featured";

export const SORT_OPTIONS: SortOption[] = [
  { value: DEFAULT_SORT, label: "Featured" },
  { value: "price-asc", label: "Price: Low to High", sortBy: "price", order: "asc" },
  { value: "price-desc", label: "Price: High to Low", sortBy: "price", order: "desc" },
  { value: "rating-desc", label: "Rating: High to Low", sortBy: "rating", order: "desc" },
  { value: "rating-asc", label: "Rating: Low to High", sortBy: "rating", order: "asc" },
  { value: "title-asc", label: "Name: A to Z", sortBy: "title", order: "asc" },
  { value: "title-desc", label: "Name: Z to A", sortBy: "title", order: "desc" },
];

export const getSortOption = (value: string | null | undefined): SortOption =>
  SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];
