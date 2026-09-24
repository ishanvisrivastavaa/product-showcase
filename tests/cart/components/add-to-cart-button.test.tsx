import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { useCartStore } from "@/features/cart/store/cart-store";

import { createMockProduct } from "../../test-utils/mock-product";

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("AddToCartButton", () => {
  it("adds one unit by default", async () => {
    const user = userEvent.setup();
    const product = createMockProduct({ id: 1, stock: 5 });

    render(<AddToCartButton product={product} />);
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(useCartStore.getState().items[0]).toMatchObject({
      id: 1,
      quantity: 1,
    });
  });

  it("adds the given quantity when provided", async () => {
    const user = userEvent.setup();
    const product = createMockProduct({ id: 1, stock: 5 });

    render(<AddToCartButton product={product} quantity={3} />);
    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(useCartStore.getState().items[0].quantity).toBe(3);
  });

  it("shows 'Added to cart' briefly after a successful click, then reverts", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    render(<AddToCartButton product={createMockProduct({ stock: 5 })} />);

    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(screen.getByRole("button")).toHaveTextContent("Added to cart");

    act(() => {
      jest.advanceTimersByTime(1500);
    });
    expect(screen.getByRole("button")).toHaveTextContent("Add to cart");

    jest.useRealTimers();
  });

  it("does not affect the cart-store contract when re-clicked while showing feedback", async () => {
    const user = userEvent.setup();
    const product = createMockProduct({ id: 1, stock: 5 });

    render(<AddToCartButton product={product} />);
    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(2);
  });

  describe("compact mode", () => {
    it("labels the button with the product name for accessibility", () => {
      render(
        <AddToCartButton
          product={createMockProduct({ title: "Desk Lamp" })}
          compact
        />,
      );

      expect(
        screen.getByRole("button", { name: "Add Desk Lamp to cart" }),
      ).toBeInTheDocument();
    });

    it("shows 'Sold out' and disables the button when there is no stock", () => {
      render(
        <AddToCartButton product={createMockProduct({ stock: 0 })} compact />,
      );

      expect(screen.getByRole("button")).toBeDisabled();
      expect(screen.getByText("Sold out")).toBeInTheDocument();
    });

    it("shows 'Add to cart' when the product is not yet in the cart", () => {
      render(
        <AddToCartButton product={createMockProduct({ id: 1 })} compact />,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Add to cart");
    });

    it("shows 'Added to cart' as soon as the product is already in the cart", () => {
      useCartStore.setState({
        items: [
          {
            id: 1,
            title: "A",
            thumbnail: "",
            price: 10,
            stock: 5,
            quantity: 1,
          },
        ],
      });

      render(
        <AddToCartButton product={createMockProduct({ id: 1 })} compact />,
      );

      expect(screen.getByRole("button")).toHaveTextContent("Added to cart");
    });

    it("keeps showing 'Added to cart' after clicking, with no timeout reverting it", async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      const product = createMockProduct({ id: 1, stock: 5 });

      render(<AddToCartButton product={product} compact />);
      await user.click(screen.getByRole("button"));
      expect(screen.getByRole("button")).toHaveTextContent("Added to cart");

      act(() => {
        jest.advanceTimersByTime(10_000);
      });
      expect(screen.getByRole("button")).toHaveTextContent("Added to cart");

      jest.useRealTimers();
    });

    it("reverts to 'Add to cart' once the product is removed from the cart", () => {
      useCartStore.setState({
        items: [
          {
            id: 1,
            title: "A",
            thumbnail: "",
            price: 10,
            stock: 5,
            quantity: 1,
          },
        ],
      });

      render(
        <AddToCartButton product={createMockProduct({ id: 1 })} compact />,
      );
      expect(screen.getByRole("button")).toHaveTextContent("Added to cart");

      act(() => {
        useCartStore.getState().removeItem(1);
      });

      expect(screen.getByRole("button")).toHaveTextContent("Add to cart");
    });

    it("still adds another unit when clicked while already in the cart", async () => {
      const user = userEvent.setup();
      useCartStore.setState({
        items: [
          {
            id: 1,
            title: "A",
            thumbnail: "",
            price: 10,
            stock: 5,
            quantity: 1,
          },
        ],
      });

      render(
        <AddToCartButton
          product={createMockProduct({ id: 1, stock: 5 })}
          compact
        />,
      );
      await user.click(screen.getByRole("button"));

      expect(useCartStore.getState().items[0].quantity).toBe(2);
    });
  });

  describe("full mode", () => {
    it("shows 'Out of stock' and disables the button when there is no stock", () => {
      render(<AddToCartButton product={createMockProduct({ stock: 0 })} />);

      expect(screen.getByRole("button")).toBeDisabled();
      expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });
  });
});
