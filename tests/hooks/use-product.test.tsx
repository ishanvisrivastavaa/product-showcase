jest.mock("../../src/services", () => ({
  getProducts: jest.fn(),
  getProduct: jest.fn(),
  searchProducts: jest.fn(),
  getProductCategories: jest.fn(),
  getProductsByCategory: jest.fn(),
}));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import {
  useProductCategory,
  useProductDetail,
  useProducts,
  useProductsByCategory,
  useSearchProducts,
} from "@/hooks/product/use-product";
import {
  getProduct,
  getProductCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("useProducts", () => {
  it("fetches the product list with the given params", async () => {
    (getProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    });

    const { result } = renderHook(() => useProducts({ skip: 0, limit: 12 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getProducts).toHaveBeenCalledWith({ skip: 0, limit: 12 });
  });
});

describe("useProductDetail", () => {
  it("fetches a product by id when the id is non-empty", async () => {
    (getProduct as jest.Mock).mockResolvedValue({ id: 1 });

    const { result } = renderHook(() => useProductDetail("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getProduct).toHaveBeenCalledWith("1");
  });

  it("does not fetch when the id is empty", () => {
    renderHook(() => useProductDetail(""), { wrapper: createWrapper() });

    expect(getProduct).not.toHaveBeenCalled();
  });
});

describe("useSearchProducts", () => {
  it("searches when the query is non-empty", async () => {
    (searchProducts as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    });

    const { result } = renderHook(() => useSearchProducts("phone"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(searchProducts).toHaveBeenCalledWith({ q: "phone" });
  });

  it("does not search when the query is blank", () => {
    renderHook(() => useSearchProducts("   "), { wrapper: createWrapper() });

    expect(searchProducts).not.toHaveBeenCalled();
  });
});

describe("useProductCategory", () => {
  it("fetches the category list", async () => {
    (getProductCategories as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useProductCategory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getProductCategories).toHaveBeenCalledTimes(1);
  });
});

describe("useProductsByCategory", () => {
  it("fetches products for a given category", async () => {
    (getProductsByCategory as jest.Mock).mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 12,
    });

    const { result } = renderHook(() => useProductsByCategory("beauty"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getProductsByCategory).toHaveBeenCalledWith({ category: "beauty" });
  });

  it("does not fetch when the category is empty", () => {
    renderHook(() => useProductsByCategory(""), { wrapper: createWrapper() });

    expect(getProductsByCategory).not.toHaveBeenCalled();
  });
});
