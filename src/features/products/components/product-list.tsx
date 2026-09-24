"use client";

import { useCallback, useMemo } from "react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDebouncedUrlParam } from "@/hooks/common/use-debounced-url-param";
import { useProductCategory } from "@/hooks";
import { PRODUCT_PAGE_SIZE } from "@/constants";
import { formatSlug } from "@/lib/format/text";

import { DEFAULT_SORT, getSortOption } from "../constants/sort-options";
import { useProductFilters } from "../hooks/use-product-filters";
import { useProductListing } from "../hooks/use-product-listing";
import {
  buildActiveFilters,
  getProductListHeading,
  getProductListResultLabel,
} from "../utils/filter-helpers";
import { ActiveFilters } from "./active-filters";
import { FilterSidebar } from "./filter-sidebar";
import { Pagination } from "./pagination";
import { ProductGrid } from "./product-grid";
import { ProductListHeader } from "./product-list-header";

export const ProductList = () => {
  const { data: categories, isPending: categoriesLoading } =
    useProductCategory();

  const allowedSlugs = useMemo(
    () => categories?.map((item) => item.slug),
    [categories],
  );

  const { filters, setFilters } = useProductFilters(allowedSlugs);

  const handleSearchUpdate = useCallback(
    (search: string) => {
      setFilters({
        search,
        ...(search ? { category: "" } : {}),
      });
    },
    [setFilters],
  );

  const [searchInput, setSearchInput] = useDebouncedUrlParam({
    value: filters.search,
    onUpdate: handleSearchUpdate,
    delay: 400,
  });

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

  const {
    activeQuery,
    products,
    total,
    totalPages,
    searchEnabled,
    categoryEnabled,
  } = useProductListing({ filters, requestParams });

  const categoryName =
    categories?.find((item) => item.slug === filters.category)?.name ??
    formatSlug(filters.category);

  const handleCategoryChange = (category: string) => {
    setSearchInput("");
    setFilters({ category, search: "" });
  };

  const clearAll = () => {
    setSearchInput("");
    setFilters({
      search: "",
      category: "",
      sort: DEFAULT_SORT,
    });
  };

  const activeFilters = buildActiveFilters({
    search: filters.search,
    categoryEnabled,
    categoryName,
    sort: filters.sort,
    sortLabel: sortOption.label,
    defaultSort: DEFAULT_SORT,
    onRemoveSearch: () => {
      setSearchInput("");
      setFilters({ search: "" });
    },
    onRemoveCategory: () => setFilters({ category: "" }),
    onRemoveSort: () => setFilters({ sort: DEFAULT_SORT }),
  });

  const heading = getProductListHeading({
    searchEnabled,
    categoryEnabled,
    search: filters.search,
    categoryName,
  });

  const resultLabel = getProductListResultLabel({
    isPending: activeQuery.isPending,
    isSuccess: activeQuery.isSuccess,
    total,
    skip,
    productsCount: products.length,
  });

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
