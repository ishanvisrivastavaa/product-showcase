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
import { formatPrice } from "@/lib/format/number";
import { formatSlug } from "@/lib/format/text";

import { DEFAULT_SORT, getSortOption } from "../constants/sort-options";
import { useProductFilters } from "../hooks/use-product-filters";
import type { ActiveFilter } from "../types/filter.types";
import { ActiveFilters } from "./active-filters";
import { FilterSidebar } from "./filter-sidebar";
import { Pagination } from "./pagination";
import { ProductGrid } from "./product-grid";
import { ProductListHeader } from "./product-list-header";

const toPriceInput = (value: number | null) =>
  value === null ? "" : String(value);

const toPriceValue = (value: string): number | null => {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const price = Number(trimmed);
  return Number.isFinite(price) && price >= 0 ? price : null;
};

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

  const [minPriceInput, setMinPriceInput] = useState(
    toPriceInput(filters.minPrice),
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    toPriceInput(filters.maxPrice),
  );
  const [syncedPrice, setSyncedPrice] = useState({
    min: filters.minPrice,
    max: filters.maxPrice,
  });
  if (
    filters.minPrice !== syncedPrice.min ||
    filters.maxPrice !== syncedPrice.max
  ) {
    setSyncedPrice({ min: filters.minPrice, max: filters.maxPrice });
    setMinPriceInput(toPriceInput(filters.minPrice));
    setMaxPriceInput(toPriceInput(filters.maxPrice));
  }
  const debouncedMinPrice = useDebounce(minPriceInput.trim(), 400);
  const debouncedMaxPrice = useDebounce(maxPriceInput.trim(), 400);

  useEffect(() => {
    const settled = debouncedSearch === searchInput.trim();
    if (!settled || debouncedSearch === filters.search) return;
    setFilters({
      search: debouncedSearch,
      ...(debouncedSearch ? { category: "" } : {}),
    });
  }, [debouncedSearch, searchInput, filters.search, setFilters]);

  useEffect(() => {
    const settled =
      debouncedMinPrice === minPriceInput.trim() &&
      debouncedMaxPrice === maxPriceInput.trim();
    if (!settled) return;

    const minPrice = toPriceValue(debouncedMinPrice);
    const maxPrice = toPriceValue(debouncedMaxPrice);
    if (minPrice === filters.minPrice && maxPrice === filters.maxPrice) return;

    setFilters({ minPrice, maxPrice });
  }, [
    debouncedMinPrice,
    debouncedMaxPrice,
    minPriceInput,
    maxPriceInput,
    filters.minPrice,
    filters.maxPrice,
    setFilters,
  ]);

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

  const fetchedProducts = useMemo(
    () => activeQuery.data?.products ?? [],
    [activeQuery.data],
  );
  const priceEnabled = filters.minPrice !== null || filters.maxPrice !== null;
  const products = useMemo(
    () =>
      priceEnabled
        ? fetchedProducts.filter(
            (product) =>
              (filters.minPrice === null ||
                product.price >= filters.minPrice) &&
              (filters.maxPrice === null || product.price <= filters.maxPrice),
          )
        : fetchedProducts,
    [fetchedProducts, priceEnabled, filters.minPrice, filters.maxPrice],
  );

  const total = activeQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PRODUCT_PAGE_SIZE));

  const categoryName =
    categories?.find((item) => item.slug === filters.category)?.name ??
    formatSlug(filters.category);

  const handleCategoryChange = (category: string) => {
    setSearchInput("");
    setFilters({ category, search: "" });
  };

  const clearPrice = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setFilters({ minPrice: null, maxPrice: null });
  };

  const clearAll = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setFilters({
      search: "",
      category: "",
      sort: DEFAULT_SORT,
      minPrice: null,
      maxPrice: null,
    });
  };

  const priceLabel =
    filters.minPrice !== null && filters.maxPrice !== null
      ? `${formatPrice(filters.minPrice)} – ${formatPrice(filters.maxPrice)}`
      : filters.minPrice !== null
        ? `From ${formatPrice(filters.minPrice)}`
        : filters.maxPrice !== null
          ? `Up to ${formatPrice(filters.maxPrice)}`
          : "";

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
  if (priceEnabled) {
    activeFilters.push({
      key: "price",
      label: "Price",
      value: priceLabel,
      onRemove: clearPrice,
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

  const resultLabel = activeQuery.isPending
    ? "Loading products…"
    : !activeQuery.isSuccess || total === 0
      ? "No products"
      : priceEnabled
        ? `Showing ${products.length} of ${fetchedProducts.length} products in this price range`
        : `Showing ${skip + 1}–${Math.min(skip + products.length, total)} of ${total} products`;

  const filterSidebarProps = {
    search: searchInput,
    onSearchChange: setSearchInput,
    category: categoryEnabled ? filters.category : "",
    onCategoryChange: handleCategoryChange,
    sort: filters.sort,
    onSortChange: (sort: string) => setFilters({ sort }),
    minPrice: minPriceInput,
    onMinPriceChange: setMinPriceInput,
    maxPrice: maxPriceInput,
    onMaxPriceChange: setMaxPriceInput,
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
            emptyDescription="Try a different search term, price range, or browse another category."
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
