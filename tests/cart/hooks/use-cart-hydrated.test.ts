import { act, renderHook } from "@testing-library/react";

import { useCartStore } from "@/features/cart/store/cart-store";
import { useCartHydrated } from "@/features/cart/hooks/use-cart-hydrated";

describe("useCartHydrated", () => {
  it("returns false initially when store has not hydrated", () => {
    const hasHydratedSpy = jest
      .spyOn(useCartStore.persist, "hasHydrated")
      .mockReturnValue(false);

    const { result } = renderHook(() => useCartHydrated());
    expect(result.current).toBe(false);

    hasHydratedSpy.mockRestore();
  });

  it("returns true when store has finished hydration", async () => {
    await act(async () => {
      await useCartStore.persist.rehydrate();
    });

    const { result } = renderHook(() => useCartHydrated());
    expect(result.current).toBe(true);
  });
});
