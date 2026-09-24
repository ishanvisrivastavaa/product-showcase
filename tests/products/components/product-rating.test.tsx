import { render, screen } from "@testing-library/react";

import { ProductRating } from "@/features/products/components/product-rating";

describe("ProductRating", () => {
  it("announces the numeric rating for screen readers", () => {
    render(<ProductRating rating={4.5} />);

    expect(screen.getByText("Rating: 4.5 out of 5")).toBeInTheDocument();
  });

  it("shows the review count in parentheses when provided", () => {
    render(<ProductRating rating={4.5} reviewCount={12} />);

    expect(screen.getByText("(12)")).toBeInTheDocument();
  });

  it("omits the review count when it is not provided", () => {
    render(<ProductRating rating={4.5} />);

    expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
  });

  it("shows the review count even when it is zero", () => {
    render(<ProductRating rating={0} reviewCount={0} />);

    expect(screen.getByText("(0)")).toBeInTheDocument();
  });
});
