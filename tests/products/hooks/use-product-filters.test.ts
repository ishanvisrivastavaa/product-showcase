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

    expect(mockReplace).toHaveBeenCalledWith("/?category=beauty", { scroll: false });
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

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
