import { render } from "@testing-library/react";

import { useCartStore } from "@/features/cart/store/cart-store";
import { StoreHydrator } from "@/providers/store-hydrator";

describe("StoreHydrator", () => {
  it("triggers cart store rehydration on mount", () => {
    const rehydrateSpy = jest
      .spyOn(useCartStore.persist, "rehydrate")
      .mockResolvedValue(undefined);

    render(<StoreHydrator />);

    expect(rehydrateSpy).toHaveBeenCalledTimes(1);
    rehydrateSpy.mockRestore();
  });

  it("renders nothing", () => {
    const { container } = render(<StoreHydrator />);

    expect(container).toBeEmptyDOMElement();
  });
});
