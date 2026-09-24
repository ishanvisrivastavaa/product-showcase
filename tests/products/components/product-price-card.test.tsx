import { render, screen } from "@testing-library/react";

import { useCartStore } from "@/features/cart/store/cart-store";
import { ProductPriceCard } from "@/features/products/components/product-price-card";

import { createMockProduct } from "../../test-utils/mock-product";

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("ProductPriceCard", () => {
  it("shows the plain price when there is no discount", () => {
    const product = createMockProduct({ price: 100, discountPercentage: 0 });

    render(
      <ProductPriceCard
        product={product}
        categoryName="Electronics"
        categoryHref="/?category=electronics"
      />,
    );

    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.queryByText(/save/i)).not.toBeInTheDocument();
  });

  it("shows the discounted price, the original struck-through price, and a savings badge", () => {
    const product = createMockProduct({ price: 100, discountPercentage: 25 });

    render(
      <ProductPriceCard
        product={product}
        categoryName="Electronics"
        categoryHref="/?category=electronics"
      />,
    );

    expect(screen.getByText("$75.00")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("Save 25%")).toBeInTheDocument();
  });

  it("shows the current stock availability", () => {
    const product = createMockProduct({
      stock: 4,
      availabilityStatus: "Low Stock",
    });

    render(
      <ProductPriceCard
        product={product}
        categoryName="Electronics"
        categoryHref="/?category=electronics"
      />,
    );

    expect(screen.getByText("Low Stock")).toBeInTheDocument();
    expect(screen.getByText(/4 in stock/)).toBeInTheDocument();
  });

  it("links to the given category href", () => {
    render(
      <ProductPriceCard
        product={createMockProduct()}
        categoryName="Electronics"
        categoryHref="/?category=electronics"
      />,
    );

    expect(
      screen.getByRole("link", { name: "More from Electronics" }),
    ).toHaveAttribute("href", "/?category=electronics");
  });
});
