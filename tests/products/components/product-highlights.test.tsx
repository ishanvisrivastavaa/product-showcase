import { render, screen } from "@testing-library/react";

import { ProductHighlights } from "@/features/products/components/product-highlights";

import { createMockProduct } from "../../test-utils/mock-product";

describe("ProductHighlights", () => {
  it("shows the shipping, warranty, and return information from the product", () => {
    const product = createMockProduct({
      shippingInformation: "Ships in 2 days",
      warrantyInformation: "2 year warranty",
      returnPolicy: "60 days return",
    });

    render(<ProductHighlights product={product} />);

    expect(screen.getByText("Ships in 2 days")).toBeInTheDocument();
    expect(screen.getByText("2 year warranty")).toBeInTheDocument();
    expect(screen.getByText("60 days return")).toBeInTheDocument();
  });
});
