import { formatSlug } from "@/lib/format/text";

describe("formatSlug", () => {
  it("capitalizes every hyphen-separated word", () => {
    expect(formatSlug("mens-shirts")).toBe("Mens Shirts");
  });

  it("capitalizes a single word", () => {
    expect(formatSlug("beauty")).toBe("Beauty");
  });

  it("returns an empty string for an empty slug", () => {
    expect(formatSlug("")).toBe("");
  });
});
