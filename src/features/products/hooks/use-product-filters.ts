"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DEFAULT_SORT, getSortOption } from "../constants/sort-options";
import type { ProductFilterState } from "../types/filter.types";

const parsePrice = (value: string | null): number | null => {
  if (value === null || value.trim() === "") return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
};

export const useProductFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<ProductFilterState>(() => {
    const page = Number(searchParams.get("page"));
    const minPrice = parsePrice(searchParams.get("minPrice"));
    const maxPrice = parsePrice(searchParams.get("maxPrice"));
    const inverted =
      minPrice !== null && maxPrice !== null && minPrice > maxPrice;

    return {
      search: searchParams.get("q")?.trim() ?? "",
      category: searchParams.get("category") ?? "",
      sort: getSortOption(searchParams.get("sort")).value,
      page: Number.isInteger(page) && page > 0 ? page : 1,
      minPrice: inverted ? maxPrice : minPrice,
      maxPrice: inverted ? minPrice : maxPrice,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (update: Partial<ProductFilterState>) => {
      const next = { ...filters, page: 1, ...update };
      const params = new URLSearchParams();
      if (next.search) params.set("q", next.search);
      if (next.category) params.set("category", next.category);
      if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
      if (next.minPrice !== null) params.set("minPrice", String(next.minPrice));
      if (next.maxPrice !== null) params.set("maxPrice", String(next.maxPrice));
      if (next.page > 1) params.set("page", String(next.page));

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters, pathname, router],
  );

  return { filters, setFilters };
};
