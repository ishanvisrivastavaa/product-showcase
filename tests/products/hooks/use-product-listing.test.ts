jest.mock("../../../src/hooks", () => ({
  useProducts: jest.fn(),
  useProductsByCategory: jest.fn(),
  useSearchProducts: jest.fn(),
}));

import { renderHook } from "@testing-library/react";

import {
  useProducts,
  useProductsByCategory,
  useSearchProducts,
} from "@/hooks";
import { useProductListing } from "@/features/products/hooks/use-product-listing";
import type { ProductFilterState } from "@/features/products/types/filter.types";

const mockUseProducts = useProducts as jest.Mock;
const mockUseProductsByCategory = useProductsByCategory as jest.Mock;
const mockUseSearchProducts = useSearchProducts as jest.Mock;

describe("useProductListing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("selects list query when neither search nor category is present", () => {
    mockUseProducts.mockReturnValue({
      data: { products: [{ id: 1 }], total: 1 },
      isSuccess: true,
    });
    mockUseProductsByCategory.mockReturnValue({});
    mockUseSearchProducts.mockReturnValue({});

    const filters: ProductFilterState = {
      search: "",
      category: "",
      sort: "featured",
      page: 1,
    };
    const requestParams = { skip: 0, limit: 12 };

    const { result } = renderHook(() =>
      useProductListing({ filters, requestParams }),
    );

    expect(result.current.searchEnabled).toBe(false);
    expect(result.current.categoryEnabled).toBe(false);
    expect(result.current.products).toHaveLength(1);
    expect(result.current.total).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it("selects search query when search is provided", () => {
    mockUseProducts.mockReturnValue({});
    mockUseProductsByCategory.mockReturnValue({});
    mockUseSearchProducts.mockReturnValue({
      data: { products: [{ id: 2 }], total: 24 },
      isSuccess: true,
    });

    const filters: ProductFilterState = {
      search: "phone",
      category: "electronics",
      sort: "featured",
      page: 1,
    };
    const requestParams = { skip: 0, limit: 12 };

    const { result } = renderHook(() =>
      useProductListing({ filters, requestParams }),
    );

    expect(result.current.searchEnabled).toBe(true);
    expect(result.current.categoryEnabled).toBe(false);
    expect(result.current.total).toBe(24);
    expect(result.current.totalPages).toBe(2);
  });

  it("selects category query when category is provided without search", () => {
    mockUseProducts.mockReturnValue({});
    mockUseProductsByCategory.mockReturnValue({
      data: { products: [{ id: 3 }], total: 10 },
      isSuccess: true,
    });
    mockUseSearchProducts.mockReturnValue({});

    const filters: ProductFilterState = {
      search: "",
      category: "beauty",
      sort: "featured",
      page: 1,
    };
    const requestParams = { skip: 0, limit: 12 };

    const { result } = renderHook(() =>
      useProductListing({ filters, requestParams }),
    );

    expect(result.current.searchEnabled).toBe(false);
    expect(result.current.categoryEnabled).toBe(true);
    expect(result.current.total).toBe(10);
    expect(result.current.totalPages).toBe(1);
  });
});
