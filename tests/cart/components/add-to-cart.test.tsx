import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { createMockProduct } from "../../test-utils/mock-product";

import { useCartStore } from "@/features/cart/store/cart-store";
import { AddToCart } from "@/features/cart/components/add-to-cart";

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("AddToCart", () => {
  it("adds a single unit to the cart by default", async () => {
    const user = userEvent.setup();
    render(<AddToCart product={createMockProduct({ id: 1, stock: 5 })} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(useCartStore.getState().items[0]).toMatchObject({
      id: 1,
      quantity: 1,
    });
  });

  it("adds the quantity selected via the stepper", async () => {
    const user = userEvent.setup();
    render(<AddToCart product={createMockProduct({ id: 1, stock: 5 })} />);

    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("disables the action and labels it out of stock when stock is 0", () => {
    render(<AddToCart product={createMockProduct({ stock: 0 })} />);

    expect(
      screen.getByRole("button", { name: /out of stock/i }),
    ).toBeDisabled();
  });

  it("does not let the stepper exceed the available stock", () => {
    render(<AddToCart product={createMockProduct({ stock: 1 })} />);

    expect(
      screen.getByRole("button", { name: "Increase quantity" }),
    ).toBeDisabled();
  });
});
