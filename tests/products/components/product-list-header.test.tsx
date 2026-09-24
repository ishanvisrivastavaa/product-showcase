import { render, screen } from "@testing-library/react";

import { ProductListHeader } from "@/features/products/components/product-list-header";

describe("ProductListHeader", () => {
  it("shows the heading and result label", () => {
    render(
      <ProductListHeader heading="All products" resultLabel="Showing 1–12 of 194 products" />,
    );

    expect(screen.getByRole("heading", { name: "All products" })).toBeInTheDocument();
    expect(screen.getByText("Showing 1–12 of 194 products")).toBeInTheDocument();
  });
});
