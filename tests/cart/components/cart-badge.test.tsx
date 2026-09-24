import { render, screen } from "@testing-library/react";

import { useCartStore } from "@/features/cart/store/cart-store";
import { CartBadge } from "@/features/cart/components/cart-badge";

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("CartBadge", () => {
  it("links to the cart page and announces zero items when empty", () => {
    render(<CartBadge />);

    const link = screen.getByRole("link", { name: "Cart, 0 items" });
    expect(link).toHaveAttribute("href", "/cart");
  });

  it("does not render a count bubble when the cart is empty", () => {
    render(<CartBadge />);

    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows the total quantity across all line items", () => {
    useCartStore.setState({
      items: [
        { id: 1, title: "A", thumbnail: "", price: 10, stock: 5, quantity: 2 },
        { id: 2, title: "B", thumbnail: "", price: 5, stock: 5, quantity: 3 },
      ],
    });

    render(<CartBadge />);

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Cart, 5 items" }),
    ).toBeInTheDocument();
  });

  it("uses the singular label for exactly one item", () => {
    useCartStore.setState({
      items: [
        { id: 1, title: "A", thumbnail: "", price: 10, stock: 5, quantity: 1 },
      ],
    });

    render(<CartBadge />);

    expect(
      screen.getByRole("link", { name: "Cart, 1 item" }),
    ).toBeInTheDocument();
  });

  it("caps the displayed count at 99+", () => {
    useCartStore.setState({
      items: [
        {
          id: 1,
          title: "A",
          thumbnail: "",
          price: 10,
          stock: 500,
          quantity: 150,
        },
      ],
    });

    render(<CartBadge />);

    expect(screen.getByText("99+")).toBeInTheDocument();
  });
});
