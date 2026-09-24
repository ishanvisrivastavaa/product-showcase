"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { DEFAULT_SORT, getSortOption } from "../constants/sort-options";
import type { ProductFilterState } from "../types/filter.types";

const isValidSlug = (slug: string) =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug);

export const useProductFilters = (knownCategories?: string[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<ProductFilterState>(() => {
    const page = Number(searchParams.get("page"));
    const rawCategory = searchParams.get("category")?.trim() ?? "";

    let category = "";
    if (rawCategory) {
      if (knownCategories && knownCategories.length > 0) {
        category = knownCategories.includes(rawCategory) ? rawCategory : "";
      } else if (isValidSlug(rawCategory)) {
        category = rawCategory;
      }
    }

    return {
      search: searchParams.get("q")?.trim() ?? "",
      category,
      sort: getSortOption(searchParams.get("sort")).value,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    };
  }, [searchParams, knownCategories]);

  const setFilters = useCallback(
    (update: Partial<ProductFilterState>) => {
      const next = { ...filters, page: 1, ...update };
      const params = new URLSearchParams();
      if (next.search) params.set("q", next.search);
      if (next.category) params.set("category", next.category);
      if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);
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
