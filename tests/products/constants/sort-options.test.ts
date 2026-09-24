import { DEFAULT_SORT, SORT_OPTIONS, getSortOption } from "@/features/products/constants/sort-options";

describe("getSortOption", () => {
  it("returns the matching option for a known value", () => {
    expect(getSortOption("price-asc")).toEqual(
      SORT_OPTIONS.find((option) => option.value === "price-asc"),
    );
  });

  it("falls back to the default option for an unknown value", () => {
    expect(getSortOption("not-a-real-option").value).toBe(DEFAULT_SORT);
  });

  it("falls back to the default option for null or undefined", () => {
    expect(getSortOption(null).value).toBe(DEFAULT_SORT);
    expect(getSortOption(undefined).value).toBe(DEFAULT_SORT);
  });
});
