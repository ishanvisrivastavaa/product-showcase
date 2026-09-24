"use client";

import { useEffect, useMemo, useState } from "react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDebounce } from "@/hooks/common/use-debounce";
import {
  useProductCategory,
  useProducts,
  useProductsByCategory,
  useSearchProducts,
} from "@/hooks";
import { PRODUCT_PAGE_SIZE } from "@/constants";
import { formatSlug } from "@/lib/format/text";

import { DEFAULT_SORT, getSortOption } from "../constants/sort-options";
import { useProductFilters } from "../hooks/use-product-filters";
import type { ActiveFilter } from "../types/filter.types";
import { ActiveFilters } from "./active-filters";
import { FilterSidebar } from "./filter-sidebar";
import { Pagination } from "./pagination";
import { ProductGrid } from "./product-grid";
import { ProductListHeader } from "./product-list-header";

export const ProductList = () => {
  const { filters, setFilters } = useProductFilters();
  const { data: categories, isPending: categoriesLoading } =
    useProductCategory();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [syncedSearch, setSyncedSearch] = useState(filters.search);
  if (filters.search !== syncedSearch) {
    setSyncedSearch(filters.search);
    setSearchInput(filters.search);
  }
  const debouncedSearch = useDebounce(searchInput.trim(), 400);

  useEffect(() => {
    const settled = debouncedSearch === searchInput.trim();
    if (!settled || debouncedSearch === filters.search) return;
    setFilters({
      search: debouncedSearch,
      ...(debouncedSearch ? { category: "" } : {}),
    });
  }, [debouncedSearch, searchInput, filters.search, setFilters]);

  const sortOption = getSortOption(filters.sort);
  const skip = (filters.page - 1) * PRODUCT_PAGE_SIZE;
  const requestParams = useMemo(
    () => ({
      skip,
      limit: PRODUCT_PAGE_SIZE,
      sortBy: sortOption.sortBy,
      order: sortOption.order,
    }),
    [skip, sortOption.sortBy, sortOption.order],
  );

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

  const products = activeQuery.data?.products ?? [];
  const total = activeQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE));

  const categoryName =
    categories?.find((item) => item.slug === filters.category)?.name ??
    formatSlug(filters.category);

  const handleCategoryChange = (category: string) => {
    setSearchInput("");
    setFilters({ category, search: "" });
  };

  const clearAll = () => {
    setSearchInput("");
    setFilters({ search: "", category: "", sort: DEFAULT_SORT });
  };

  const activeFilters: ActiveFilter[] = [];
  if (filters.search) {
    activeFilters.push({
      key: "search",
      label: "Search",
      value: `“${filters.search}”`,
      onRemove: () => setFilters({ search: "" }),
    });
  }
  if (categoryEnabled) {
    activeFilters.push({
      key: "category",
      label: "Category",
      value: categoryName,
      onRemove: () => setFilters({ category: "" }),
    });
  }
  if (filters.sort !== DEFAULT_SORT) {
    activeFilters.push({
      key: "sort",
      label: "Sort",
      value: sortOption.label,
      onRemove: () => setFilters({ sort: DEFAULT_SORT }),
    });
  }

  const heading = searchEnabled
    ? `Results for “${filters.search}”`
    : categoryEnabled
      ? categoryName
      : "All products";

  const resultLabel =
    activeQuery.isSuccess && total > 0
      ? `Showing ${skip + 1}–${Math.min(skip + products.length, total)} of ${total} products`
      : activeQuery.isPending
        ? "Loading products…"
        : "No products";

  const filterSidebarProps = {
    search: searchInput,
    onSearchChange: setSearchInput,
    category: categoryEnabled ? filters.category : "",
    onCategoryChange: handleCategoryChange,
    sort: filters.sort,
    onSortChange: (sort: string) => setFilters({ sort }),
    categories,
    categoriesLoading,
  };

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: heading }]} />

      <ProductListHeader heading={heading} resultLabel={resultLabel} />

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside aria-label="Product filters">
          <Card className="h-fit p-5 lg:sticky lg:top-24">
            <FilterSidebar {...filterSidebarProps} />
          </Card>
        </aside>

        <section className="flex min-w-0 flex-col gap-6">
          <ActiveFilters filters={activeFilters} onClearAll={clearAll} />

          <ProductGrid
            products={products}
            isLoading={activeQuery.isPending}
            isError={activeQuery.isError}
            errorMessage={activeQuery.error?.message}
            onRetry={activeQuery.refetch}
            emptyTitle="No products found"
            emptyDescription="Try a different search term or browse another category."
            emptyAction={
              activeFilters.length > 0 ? (
                <Button variant="secondary" onClick={clearAll}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />

          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => setFilters({ page })}
          />
        </section>
      </div>
    </div>
  );
};
