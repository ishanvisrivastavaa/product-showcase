import { render } from "@testing-library/react";

import { ProductDetailSkeleton } from "@/features/products/components/product-detail-skeleton";

describe("ProductDetailSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ProductDetailSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
