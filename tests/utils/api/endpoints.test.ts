import { endpoints } from "@/lib/api/endpoints";

describe("endpoints.products", () => {
  it("builds static paths", () => {
    expect(endpoints.products.list).toBe("/products");
    expect(endpoints.products.search).toBe("/products/search");
    expect(endpoints.products.categories).toBe("/products/categories");
  });

  it("builds the detail path for a given id with URL encoding", () => {
    expect(endpoints.products.detail("42")).toBe("/products/42");
    expect(endpoints.products.detail("42/extra")).toBe("/products/42%2Fextra");
  });

  it("builds the category path for a given slug with URL encoding", () => {
    expect(endpoints.products.byCategory("beauty")).toBe(
      "/products/category/beauty",
    );
    expect(endpoints.products.byCategory("home & kitchen")).toBe(
      "/products/category/home%20%26%20kitchen",
    );
  });
});
