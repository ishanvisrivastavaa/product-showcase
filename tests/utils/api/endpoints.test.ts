import { endpoints } from "@/lib/api/endpoints";

describe("endpoints.products", () => {
  it("builds static paths", () => {
    expect(endpoints.products.list).toBe("/products");
    expect(endpoints.products.search).toBe("/products/search");
    expect(endpoints.products.categories).toBe("/products/categories");
  });

  it("builds the detail path for a given id", () => {
    expect(endpoints.products.detail("42")).toBe("/products/42");
  });

  it("builds the category path for a given slug", () => {
    expect(endpoints.products.byCategory("beauty")).toBe(
      "/products/category/beauty",
    );
  });
});
