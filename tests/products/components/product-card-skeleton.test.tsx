import { render } from "@testing-library/react";

import {
  ProductCardSkeleton,
  ProductGridSkeleton,
} from "@/features/products/components/product-card-skeleton";

describe("ProductCardSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ProductCardSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("ProductGridSkeleton", () => {
  it("renders 6 placeholder cards by default", () => {
    const { container } = render(<ProductGridSkeleton />);

    expect(container.firstElementChild?.childElementCount).toBe(6);
  });

  it("renders a custom number of placeholder cards", () => {
    const { container } = render(<ProductGridSkeleton count={3} />);

    expect(container.firstElementChild?.childElementCount).toBe(3);
  });
});
