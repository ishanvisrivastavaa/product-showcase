import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useCartStore } from "@/features/cart/store/cart-store";
import { CartView } from "@/features/cart/components/cart-view";

const seedCart = () => {
  useCartStore.setState({
    items: [
      {
        id: 1,
        title: "Wireless Mouse",
        thumbnail: "",
        price: 20,
        stock: 5,
        quantity: 2,
      },
      {
        id: 2,
        title: "Keyboard",
        thumbnail: "",
        price: 50,
        stock: 3,
        quantity: 1,
      },
    ],
  });
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("CartView", () => {
  it("shows an empty state with a link back to the catalog when the cart has no items", () => {
    render(<CartView />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Browse products" }),
    ).toHaveAttribute("href", "/");
  });

  it("lists every item in the cart with its line total", () => {
    seedCart();
    render(<CartView />);

    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("Keyboard")).toBeInTheDocument();
    // Wireless Mouse: $20 x 2 = $40.00
    expect(screen.getByText("$40.00")).toBeInTheDocument();
  });

  it("shows the total item count and subtotal", () => {
    seedCart();
    render(<CartView />);

    // 2 + 1 = 3 items, subtotal 20*2 + 50*1 = 90
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("$90.00")).toBeInTheDocument();
  });

  it("removes a line item when its remove button is clicked", async () => {
    const user = userEvent.setup();
    seedCart();
    render(<CartView />);

    await user.click(
      screen.getByRole("button", { name: "Remove Wireless Mouse from cart" }),
    );

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(screen.queryByText("Wireless Mouse")).not.toBeInTheDocument();
  });

  it("updates a line item's quantity from its stepper", async () => {
    const user = userEvent.setup();
    seedCart();
    render(<CartView />);

    const [increaseMouseQty] = screen.getAllByRole("button", {
      name: "Increase quantity",
    });
    await user.click(increaseMouseQty);

    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("empties the cart when 'Clear cart' is clicked", async () => {
    const user = userEvent.setup();
    seedCart();
    render(<CartView />);

    await user.click(screen.getByRole("button", { name: "Clear cart" }));

    expect(useCartStore.getState().items).toEqual([]);
  });
});
