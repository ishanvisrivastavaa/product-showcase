import { getAvailabilityVariant } from "@/features/products/utils/availability";

describe("getAvailabilityVariant", () => {
  it("returns danger when the status mentions being out of stock", () => {
    expect(getAvailabilityVariant("Out of Stock")).toBe("danger");
  });

  it("returns warning when the status mentions low stock", () => {
    expect(getAvailabilityVariant("Low Stock")).toBe("warning");
  });

  it("returns success for a normal in-stock status", () => {
    expect(getAvailabilityVariant("In Stock")).toBe("success");
  });

  it("is case-insensitive", () => {
    expect(getAvailabilityVariant("OUT OF STOCK")).toBe("danger");
    expect(getAvailabilityVariant("low stock")).toBe("warning");
  });

  it("defaults to success for an unrecognized status", () => {
    expect(getAvailabilityVariant("Discontinued")).toBe("success");
  });
});
