import { queryKeys } from "@/lib/query/query-keys";

describe("queryKeys.products", () => {
  it("builds a list key that defaults params to an empty object", () => {
    expect(queryKeys.products.list()).toEqual(["products", "list", {}]);
    expect(queryKeys.products.list({ skip: 0, limit: 12 })).toEqual([
      "products",
      "list",
      { skip: 0, limit: 12 },
    ]);
  });

  it("builds a detail key from the id", () => {
    expect(queryKeys.products.detail("7")).toEqual(["products", "detail", "7"]);
  });

  it("builds a search key from the query and params", () => {
    expect(queryKeys.products.search("phone")).toEqual([
      "products",
      "search",
      "phone",
      {},
    ]);
  });

  it("builds a category key from the category and params", () => {
    expect(queryKeys.products.byCategory("beauty")).toEqual([
      "products",
      "category",
      "beauty",
      {},
    ]);
  });

  it("exposes a stable base key for invalidation", () => {
    expect(queryKeys.products.all).toEqual(["products"]);
  });
});
