import { render, screen } from "@testing-library/react";

import { ProductSummary } from "@/features/products/components/product-summary";

import { createMockProduct } from "../../test-utils/mock-product";

describe("ProductSummary", () => {
  it("shows the category, title, and rating", () => {
    const product = createMockProduct({ title: "Wireless Mouse", brand: "" });

    render(<ProductSummary product={product} categoryName="Electronics" />);

    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Wireless Mouse" }),
    ).toBeInTheDocument();
  });

  it("shows a brand badge when the product has a brand", () => {
    const product = createMockProduct({ brand: "Logitech" });

    render(<ProductSummary product={product} categoryName="Electronics" />);

    expect(screen.getByText("Logitech")).toBeInTheDocument();
  });

  it("omits the brand badge when the product has no brand", () => {
    const product = createMockProduct({ brand: "" });

    render(<ProductSummary product={product} categoryName="Electronics" />);

    expect(screen.queryByText("TestBrand")).not.toBeInTheDocument();
  });
});
