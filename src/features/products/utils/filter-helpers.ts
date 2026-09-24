import type { ActiveFilter } from "../types/filter.types";

export interface BuildActiveFiltersParams {
  search: string;
  categoryEnabled: boolean;
  categoryName: string;
  sort: string;
  sortLabel: string;
  defaultSort: string;
  onRemoveSearch: () => void;
  onRemoveCategory: () => void;
  onRemoveSort: () => void;
}

export const buildActiveFilters = ({
  search,
  categoryEnabled,
  categoryName,
  sort,
  sortLabel,
  defaultSort,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveSort,
}: BuildActiveFiltersParams): ActiveFilter[] => {
  const activeFilters: ActiveFilter[] = [];

  if (search) {
    activeFilters.push({
      key: "search",
      label: "Search",
      value: `“${search}”`,
      onRemove: onRemoveSearch,
    });
  }

  if (categoryEnabled) {
    activeFilters.push({
      key: "category",
      label: "Category",
      value: categoryName,
      onRemove: onRemoveCategory,
    });
  }

  if (sort !== defaultSort) {
    activeFilters.push({
      key: "sort",
      label: "Sort",
      value: sortLabel,
      onRemove: onRemoveSort,
    });
  }

  return activeFilters;
};

export const getProductListHeading = ({
  searchEnabled,
  categoryEnabled,
  search,
  categoryName,
}: {
  searchEnabled: boolean;
  categoryEnabled: boolean;
  search: string;
  categoryName: string;
}): string => {
  if (searchEnabled) return `Results for “${search}”`;
  if (categoryEnabled) return categoryName;
  return "All products";
};

export const getProductListResultLabel = ({
  isPending,
  isSuccess,
  total,
  skip,
  productsCount,
}: {
  isPending: boolean;
  isSuccess: boolean;
  total: number;
  skip: number;
  productsCount: number;
}): string => {
  if (isPending) return "Loading products…";
  if (!isSuccess || total === 0) return "No products";
  return `Showing ${skip + 1}–${Math.min(skip + productsCount, total)} of ${total} products`;
};
