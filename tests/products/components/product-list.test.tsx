jest.mock("../../../src/features/products/hooks/use-product-filters", () => ({
  useProductFilters: jest.fn(),
}));

jest.mock("../../../src/hooks", () => ({
  useProductCategory: jest.fn(),
  useProducts: jest.fn(),
  useProductsByCategory: jest.fn(),
  useSearchProducts: jest.fn(),
}));

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  useProductCategory,
  useProducts,
  useProductsByCategory,
  useSearchProducts,
} from "@/hooks";
import { ProductList } from "@/features/products/components/product-list";
import { useProductFilters } from "@/features/products/hooks/use-product-filters";

import { createMockProduct } from "../../test-utils/mock-product";

const mockUseProductFilters = useProductFilters as jest.Mock;
const mockUseProductCategory = useProductCategory as jest.Mock;
const mockUseProducts = useProducts as jest.Mock;
const mockUseProductsByCategory = useProductsByCategory as jest.Mock;
const mockUseSearchProducts = useSearchProducts as jest.Mock;

const DEFAULT_FILTERS = { search: "", category: "", sort: "featured", page: 1 };

const buildQueryResult = (overrides: Record<string, unknown> = {}) => ({
  data: undefined,
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null,
  refetch: jest.fn(),
  ...overrides,
});

const setFilters = jest.fn();

const setupFilters = (filters: Partial<typeof DEFAULT_FILTERS> = {}) => {
  mockUseProductFilters.mockReturnValue({
    filters: { ...DEFAULT_FILTERS, ...filters },
    setFilters,
  });
};

beforeEach(() => {
  setFilters.mockReset();
  mockUseProductCategory.mockReturnValue(buildQueryResult({ data: [] }));
  mockUseProducts.mockReturnValue(buildQueryResult());
  mockUseProductsByCategory.mockReturnValue(buildQueryResult());
  mockUseSearchProducts.mockReturnValue(buildQueryResult());
  setupFilters();
});

describe("ProductList", () => {
  it("shows the products returned by useProducts by default", () => {
    mockUseProducts.mockReturnValue(
      buildQueryResult({
        data: { products: [createMockProduct({ id: 1, title: "Wireless Mouse" })], total: 1 },
        isSuccess: true,
      }),
    );

    render(<ProductList />);

    expect(screen.getByRole("heading", { name: "All products" })).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
  });

  it("shows loading skeletons while the list query is pending", () => {
    mockUseProducts.mockReturnValue(buildQueryResult({ isPending: true }));

    const { container } = render(<ProductList />);

    // The breadcrumb also renders a list (<ol>), so check specifically for
    // the product grid's <ul>, which only appears once products have loaded.
    expect(container.querySelector("ul")).not.toBeInTheDocument();
  });

  it("shows an error state and retries the active query", async () => {
    const user = userEvent.setup();
    const refetch = jest.fn();
    mockUseProducts.mockReturnValue(buildQueryResult({ isError: true, error: { message: "Network error" }, refetch }));

    render(<ProductList />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("switches to the search results when a search filter is active", () => {
    setupFilters({ search: "phone" });
    mockUseSearchProducts.mockReturnValue(
      buildQueryResult({
        data: { products: [createMockProduct({ id: 2, title: "Smartphone" })], total: 1 },
        isSuccess: true,
      }),
    );

    render(<ProductList />);

    expect(screen.getByRole("heading", { name: "Results for “phone”" })).toBeInTheDocument();
    expect(screen.getByText("Smartphone")).toBeInTheDocument();
  });

  it("switches to the category results when a category filter is active", () => {
    setupFilters({ category: "beauty" });
    mockUseProductCategory.mockReturnValue(
      buildQueryResult({ data: [{ slug: "beauty", name: "Beauty", url: "beauty" }] }),
    );
    mockUseProductsByCategory.mockReturnValue(
      buildQueryResult({
        data: { products: [createMockProduct({ id: 3, title: "Lipstick" })], total: 1 },
        isSuccess: true,
      }),
    );

    render(<ProductList />);

    expect(screen.getByRole("heading", { name: "Beauty" })).toBeInTheDocument();
    expect(screen.getByText("Lipstick")).toBeInTheDocument();
  });

  it("shows an active filter chip and clears it on remove", async () => {
    const user = userEvent.setup();
    setupFilters({ search: "phone" });
    mockUseSearchProducts.mockReturnValue(
      buildQueryResult({ data: { products: [], total: 0 }, isSuccess: true }),
    );

    render(<ProductList />);

    await user.click(screen.getByRole("button", { name: "Remove search filter" }));

    expect(setFilters).toHaveBeenCalledWith({ search: "" });
  });

  it("clears every filter when 'Clear all' is clicked", async () => {
    const user = userEvent.setup();
    setupFilters({ search: "phone", sort: "price-asc" });
    mockUseSearchProducts.mockReturnValue(
      buildQueryResult({ data: { products: [], total: 0 }, isSuccess: true }),
    );

    render(<ProductList />);

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(setFilters).toHaveBeenCalledWith({ search: "", category: "", sort: "featured" });
  });

  it("changes the page through pagination", async () => {
    const user = userEvent.setup();
    mockUseProducts.mockReturnValue(
      buildQueryResult({ data: { products: [createMockProduct()], total: 30 }, isSuccess: true }),
    );

    render(<ProductList />);

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(setFilters).toHaveBeenCalledWith({ page: 2 });
  });

  it("selecting a category from the sidebar clears the search box", async () => {
    const user = userEvent.setup();
    mockUseProductCategory.mockReturnValue(
      buildQueryResult({ data: [{ slug: "beauty", name: "Beauty", url: "beauty" }] }),
    );
    mockUseProducts.mockReturnValue(
      buildQueryResult({ data: { products: [], total: 0 }, isSuccess: true }),
    );

    render(<ProductList />);
    await user.click(screen.getByRole("radio", { name: "Beauty" }));

    expect(setFilters).toHaveBeenCalledWith({ category: "beauty", search: "" });
  });

  it("debounces typed search input before updating the filters", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });

    render(<ProductList />);
    await user.type(screen.getByLabelText("Search products"), "p");

    expect(setFilters).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(400);
    });

    expect(setFilters).toHaveBeenCalledWith({ search: "p", category: "" });
    jest.useRealTimers();
  });
});
