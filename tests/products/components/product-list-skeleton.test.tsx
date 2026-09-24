import { render } from "@testing-library/react";

import { ProductListSkeleton } from "@/features/products/components/product-list-skeleton";

describe("ProductListSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ProductListSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
