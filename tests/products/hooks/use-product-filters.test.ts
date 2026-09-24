const mockReplace = jest.fn();
const mockNav = {
  pathname: "/",
  searchParams: new URLSearchParams(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => mockNav.pathname,
  useSearchParams: () => mockNav.searchParams,
}));

import { act, renderHook } from "@testing-library/react";

import { useProductFilters } from "@/features/products/hooks/use-product-filters";

beforeEach(() => {
  mockReplace.mockReset();
  mockNav.pathname = "/";
  mockNav.searchParams = new URLSearchParams();
  window.scrollTo = jest.fn();
});

describe("useProductFilters", () => {
  it("defaults to page 1, no search/category, and the default sort", () => {
    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters).toEqual({
      search: "",
      category: "",
      sort: "featured",
      page: 1,
      minPrice: null,
      maxPrice: null,
    });
  });

  it("reads search, category, sort, and page from the URL", () => {
    mockNav.searchParams = new URLSearchParams(
      "q=phone&category=electronics&sort=price-asc&page=3",
    );

    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters).toEqual({
      search: "phone",
      category: "electronics",
      sort: "price-asc",
      page: 3,
      minPrice: null,
      maxPrice: null,
    });
  });

  it("falls back to the default sort for an unrecognized sort value", () => {
    mockNav.searchParams = new URLSearchParams("sort=not-a-real-sort");

    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters.sort).toBe("featured");
  });

  it("falls back to page 1 for an invalid page value", () => {
    mockNav.searchParams = new URLSearchParams("page=abc");

    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters.page).toBe(1);
  });

  it("navigates to the bare pathname when every filter is at its default", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ search: "", category: "", sort: "featured" });
    });

    expect(mockReplace).toHaveBeenCalledWith("/", { scroll: false });
  });

  it("builds a query string only from non-default values", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ search: "phone" });
    });

    expect(mockReplace).toHaveBeenCalledWith("/?q=phone", { scroll: false });
  });

  it("omits the sort param when it is reset to the default", () => {
    mockNav.searchParams = new URLSearchParams("sort=price-asc");
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ sort: "featured" });
    });

    expect(mockReplace).toHaveBeenCalledWith("/", { scroll: false });
  });

  it("resets the page to 1 when a non-page filter changes", () => {
    mockNav.searchParams = new URLSearchParams("page=3");
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ category: "beauty" });
    });

    expect(mockReplace).toHaveBeenCalledWith("/?category=beauty", {
      scroll: false,
    });
  });

  it("keeps an explicitly requested page", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ page: 2 });
    });

    expect(mockReplace).toHaveBeenCalledWith("/?page=2", { scroll: false });
  });

  it("scrolls to the top of the page on every filter change", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ search: "phone" });
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});

describe("useProductFilters price range", () => {
  it("defaults min and max price to null when absent from the URL", () => {
    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters.minPrice).toBeNull();
    expect(result.current.filters.maxPrice).toBeNull();
  });

  it("reads min and max price from the URL", () => {
    mockNav.searchParams = new URLSearchParams("minPrice=10&maxPrice=99.5");

    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters.minPrice).toBe(10);
    expect(result.current.filters.maxPrice).toBe(99.5);
  });

  it("ignores non-numeric and negative price params", () => {
    mockNav.searchParams = new URLSearchParams("minPrice=abc&maxPrice=-5");

    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters.minPrice).toBeNull();
    expect(result.current.filters.maxPrice).toBeNull();
  });

  it("swaps an inverted range so min is never above max", () => {
    mockNav.searchParams = new URLSearchParams("minPrice=200&maxPrice=50");

    const { result } = renderHook(() => useProductFilters());

    expect(result.current.filters.minPrice).toBe(50);
    expect(result.current.filters.maxPrice).toBe(200);
  });

  it("writes min and max price to the query string", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ minPrice: 10, maxPrice: 250 });
    });

    expect(mockReplace).toHaveBeenCalledWith("/?minPrice=10&maxPrice=250", {
      scroll: false,
    });
  });

  it("writes only the bound that is set", () => {
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ maxPrice: 50 });
    });

    expect(mockReplace).toHaveBeenCalledWith("/?maxPrice=50", {
      scroll: false,
    });
  });

  it("drops the price params when the range is cleared", () => {
    mockNav.searchParams = new URLSearchParams("minPrice=10&maxPrice=250");
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ minPrice: null, maxPrice: null });
    });

    expect(mockReplace).toHaveBeenCalledWith("/", { scroll: false });
  });

  it("resets the page to 1 when the price range changes", () => {
    mockNav.searchParams = new URLSearchParams("page=4");
    const { result } = renderHook(() => useProductFilters());

    act(() => {
      result.current.setFilters({ minPrice: 20 });
    });

    expect(mockReplace).toHaveBeenCalledWith("/?minPrice=20", {
      scroll: false,
    });
  });
});
