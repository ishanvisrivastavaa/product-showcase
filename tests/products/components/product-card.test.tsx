import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useCartStore } from "@/features/cart/store/cart-store";
import { ProductCard } from "@/features/products/components/product-card";

import { createMockProduct } from "../../test-utils/mock-product";

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("ProductCard", () => {
  it("shows the title, brand, and a link to the product page", () => {
    const product = createMockProduct({
      id: 7,
      title: "Wireless Mouse",
      brand: "Logitech",
    });

    render(<ProductCard product={product} />);

    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("Logitech")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Wireless Mouse" }),
    ).toHaveAttribute("href", "/product/7");
  });

  it("falls back to a formatted category label when there is no brand", () => {
    const product = createMockProduct({ brand: "", category: "home-decor" });

    render(<ProductCard product={product} />);

    expect(screen.getByText("Home Decor")).toBeInTheDocument();
  });

  it("shows the plain price without a discount badge when not discounted", () => {
    render(
      <ProductCard
        product={createMockProduct({ price: 50, discountPercentage: 0 })}
      />,
    );

    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });

  it("shows the discounted price, original price, and a discount badge when discounted", () => {
    render(
      <ProductCard
        product={createMockProduct({ price: 50, discountPercentage: 20 })}
      />,
    );

    expect(screen.getByText("$40.00")).toBeInTheDocument();
    expect(screen.getByText("$50.00")).toBeInTheDocument();
    expect(screen.getByText("-20%")).toBeInTheDocument();
  });

  it("shows the current availability status", () => {
    render(
      <ProductCard
        product={createMockProduct({ availabilityStatus: "Low Stock" })}
      />,
    );

    expect(screen.getByText("Low Stock")).toBeInTheDocument();
  });

  it("adds the product to the cart when the quick-add button is clicked", async () => {
    const user = userEvent.setup();
    const product = createMockProduct({ id: 9, title: "Desk Lamp" });

    render(<ProductCard product={product} />);
    await user.click(
      screen.getByRole("button", { name: "Add Desk Lamp to cart" }),
    );

    expect(useCartStore.getState().items[0]).toMatchObject({
      id: 9,
      quantity: 1,
    });
  });
});
