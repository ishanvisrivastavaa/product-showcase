import { renderHook, act } from "@testing-library/react";

import { useToast } from "@/components/ui/toast";
import { createMockProduct } from "../../test-utils/mock-product";

import { useCartStore } from "@/features/cart/store/cart-store";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";

beforeEach(() => {
  useCartStore.setState({ items: [] });
  useToast.setState({ toast: null });
});

describe("useAddToCart", () => {
  it("adds the product to the cart store", () => {
    const { result } = renderHook(() => useAddToCart());
    const product = createMockProduct({ id: 1 });

    act(() => {
      result.current(product, 2);
    });

    expect(useCartStore.getState().items[0]).toMatchObject({
      id: 1,
      quantity: 2,
    });
  });

  it("shows a singular toast message when adding one unit", () => {
    const { result } = renderHook(() => useAddToCart());

    act(() => {
      result.current(createMockProduct({ title: "Wireless Mouse" }), 1);
    });

    expect(useToast.getState().toast?.message).toBe(
      "Wireless Mouse added to cart",
    );
  });

  it("shows a pluralized message with the quantity when adding more than one", () => {
    const { result } = renderHook(() => useAddToCart());

    act(() => {
      result.current(createMockProduct({ title: "Wireless Mouse" }), 3);
    });

    expect(useToast.getState().toast?.message).toBe(
      "3 × Wireless Mouse added to cart",
    );
  });

  it("links the toast to the cart page", () => {
    const { result } = renderHook(() => useAddToCart());

    act(() => {
      result.current(createMockProduct(), 1);
    });

    expect(useToast.getState().toast?.link).toEqual({
      href: "/cart",
      label: "View cart",
    });
  });
});
