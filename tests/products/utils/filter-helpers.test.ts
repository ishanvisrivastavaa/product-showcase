import {
  buildActiveFilters,
  getProductListHeading,
  getProductListResultLabel,
} from "@/features/products/utils/filter-helpers";

describe("filter-helpers", () => {
  describe("buildActiveFilters", () => {
    it("returns empty array when no filters are active", () => {
      const filters = buildActiveFilters({
        search: "",
        categoryEnabled: false,
        categoryName: "",
        sort: "featured",
        sortLabel: "Featured",
        defaultSort: "featured",
        onRemoveSearch: jest.fn(),
        onRemoveCategory: jest.fn(),
        onRemoveSort: jest.fn(),
      });

      expect(filters).toEqual([]);
    });

    it("builds active filters for search, category, and sort", () => {
      const onRemoveSearch = jest.fn();
      const onRemoveCategory = jest.fn();
      const onRemoveSort = jest.fn();

      const filters = buildActiveFilters({
        search: "phone",
        categoryEnabled: true,
        categoryName: "Smartphones",
        sort: "price-asc",
        sortLabel: "Price: Low to High",
        defaultSort: "featured",
        onRemoveSearch,
        onRemoveCategory,
        onRemoveSort,
      });

      expect(filters).toHaveLength(3);
      expect(filters[0].key).toBe("search");
      expect(filters[0].value).toBe("“phone”");
      expect(filters[1].key).toBe("category");
      expect(filters[1].value).toBe("Smartphones");
      expect(filters[2].key).toBe("sort");
      expect(filters[2].value).toBe("Price: Low to High");

      filters[0].onRemove();
      expect(onRemoveSearch).toHaveBeenCalled();
      filters[1].onRemove();
      expect(onRemoveCategory).toHaveBeenCalled();
      filters[2].onRemove();
      expect(onRemoveSort).toHaveBeenCalled();
    });
  });

  describe("getProductListHeading", () => {
    it("returns search query heading when search is enabled", () => {
      expect(
        getProductListHeading({
          searchEnabled: true,
          categoryEnabled: false,
          search: "headphones",
          categoryName: "Audio",
        }),
      ).toBe("Results for “headphones”");
    });

    it("returns category name when category is enabled", () => {
      expect(
        getProductListHeading({
          searchEnabled: false,
          categoryEnabled: true,
          search: "",
          categoryName: "Laptops",
        }),
      ).toBe("Laptops");
    });

    it("returns 'All products' when neither search nor category is active", () => {
      expect(
        getProductListHeading({
          searchEnabled: false,
          categoryEnabled: false,
          search: "",
          categoryName: "",
        }),
      ).toBe("All products");
    });
  });

  describe("getProductListResultLabel", () => {
    it("returns loading state", () => {
      expect(
        getProductListResultLabel({
          isPending: true,
          isSuccess: false,
          total: 0,
          skip: 0,
          productsCount: 0,
        }),
      ).toBe("Loading products…");
    });

    it("returns 'No products' when total is 0", () => {
      expect(
        getProductListResultLabel({
          isPending: false,
          isSuccess: true,
          total: 0,
          skip: 0,
          productsCount: 0,
        }),
      ).toBe("No products");
    });

    it("returns formatted range string when products exist", () => {
      expect(
        getProductListResultLabel({
          isPending: false,
          isSuccess: true,
          total: 50,
          skip: 0,
          productsCount: 12,
        }),
      ).toBe("Showing 1–12 of 50 products");
    });
  });
});
