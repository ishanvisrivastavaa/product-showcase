jest.mock("../../../src/lib/api/client", () => ({
  apiClient: { get: jest.fn() },
}));

import { apiClient } from "@/lib/api/client";
import {
  getProduct,
  getProductCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services/product/products.service";

const mockGet = apiClient.get as jest.Mock;

beforeEach(() => {
  mockGet.mockReset();
  mockGet.mockResolvedValue({});
});

describe("products.service", () => {
  it("getProducts calls the list endpoint with the given params", async () => {
    await getProducts({ skip: 0, limit: 12 });

    expect(mockGet).toHaveBeenCalledWith("/products", {
      params: { skip: 0, limit: 12 },
      unwrapResponse: false,
    });
  });

  it("getProduct calls the detail endpoint for the given id", async () => {
    await getProduct("42");

    expect(mockGet).toHaveBeenCalledWith("/products/42", {
      unwrapResponse: false,
    });
  });

  it("searchProducts calls the search endpoint with the query and params", async () => {
    await searchProducts({ q: "phone", limit: 12 });

    expect(mockGet).toHaveBeenCalledWith("/products/search", {
      params: { q: "phone", limit: 12 },
      unwrapResponse: false,
    });
  });

  it("getProductCategories calls the categories endpoint", async () => {
    await getProductCategories();

    expect(mockGet).toHaveBeenCalledWith("/products/categories", {
      unwrapResponse: false,
    });
  });

  it("getProductsByCategory calls the category endpoint with only the query params", async () => {
    await getProductsByCategory({
      category: "beauty",
      skip: 0,
      limit: 12,
      sortBy: "price",
      order: "asc",
    });

    expect(mockGet).toHaveBeenCalledWith("/products/category/beauty", {
      params: { skip: 0, limit: 12, sortBy: "price", order: "asc" },
      unwrapResponse: false,
    });
  });
});
