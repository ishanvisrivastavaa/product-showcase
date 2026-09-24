import { createMockProduct } from "../../test-utils/mock-product";

import {
  selectCartCount,
  selectCartSubtotal,
  selectIsProductInCart,
  useCartStore,
} from "@/features/cart/store/cart-store";
import type { CartState } from "@/features/cart/store/cart-store";

const resetCart = () => useCartStore.setState({ items: [] });

beforeEach(() => {
  resetCart();
});

describe("useCartStore", () => {
  describe("addItem", () => {
    it("adds a new product with the discounted price and requested quantity", () => {
      const product = createMockProduct({
        id: 1,
        price: 200,
        discountPercentage: 10,
        stock: 5,
      });

      useCartStore.getState().addItem(product, 2);

      const [item] = useCartStore.getState().items;
      expect(item).toMatchObject({
        id: 1,
        quantity: 2,
        price: 180,
        stock: 5,
      });
    });

    it("merges quantity into the existing line when the same product is added again", () => {
      const product = createMockProduct({ id: 1, stock: 10 });

      useCartStore.getState().addItem(product, 2);
      useCartStore.getState().addItem(product, 3);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(5);
    });

    it("clamps the quantity to the available stock for a new item", () => {
      const product = createMockProduct({ id: 1, stock: 3 });

      useCartStore.getState().addItem(product, 10);

      expect(useCartStore.getState().items[0].quantity).toBe(3);
    });

    it("clamps the merged quantity to the available stock", () => {
      const product = createMockProduct({ id: 1, stock: 5 });

      useCartStore.getState().addItem(product, 4);
      useCartStore.getState().addItem(product, 4);

      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it("never adds a quantity below 1, even if a non-positive amount is passed", () => {
      const product = createMockProduct({ id: 1, stock: 5 });

      useCartStore.getState().addItem(product, 0);

      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });

    it("keeps separate line items for different products", () => {
      const first = createMockProduct({ id: 1 });
      const second = createMockProduct({ id: 2 });

      useCartStore.getState().addItem(first, 1);
      useCartStore.getState().addItem(second, 1);

      expect(useCartStore.getState().items.map((item) => item.id)).toEqual([
        1, 2,
      ]);
    });
  });

  describe("updateQuantity", () => {
    it("updates the quantity of the matching item", () => {
      useCartStore
        .getState()
        .addItem(createMockProduct({ id: 1, stock: 10 }), 1);

      useCartStore.getState().updateQuantity(1, 4);

      expect(useCartStore.getState().items[0].quantity).toBe(4);
    });

    it("clamps the updated quantity to the item's stock", () => {
      useCartStore
        .getState()
        .addItem(createMockProduct({ id: 1, stock: 3 }), 1);

      useCartStore.getState().updateQuantity(1, 99);

      expect(useCartStore.getState().items[0].quantity).toBe(3);
    });

    it("never lets the quantity drop below 1", () => {
      useCartStore
        .getState()
        .addItem(createMockProduct({ id: 1, stock: 5 }), 2);

      useCartStore.getState().updateQuantity(1, -3);

      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });

    it("is a no-op for an id that is not in the cart", () => {
      useCartStore.getState().addItem(createMockProduct({ id: 1 }), 1);

      useCartStore.getState().updateQuantity(999, 5);

      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0].quantity).toBe(1);
    });
  });

  describe("removeItem", () => {
    it("removes only the matching item", () => {
      useCartStore.getState().addItem(createMockProduct({ id: 1 }), 1);
      useCartStore.getState().addItem(createMockProduct({ id: 2 }), 1);

      useCartStore.getState().removeItem(1);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(2);
    });

    it("is a no-op for an id that is not in the cart", () => {
      useCartStore.getState().addItem(createMockProduct({ id: 1 }), 1);

      useCartStore.getState().removeItem(999);

      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe("clearCart", () => {
    it("empties the cart", () => {
      useCartStore.getState().addItem(createMockProduct({ id: 1 }), 1);
      useCartStore.getState().addItem(createMockProduct({ id: 2 }), 1);

      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toEqual([]);
    });
  });

  describe("selectCartCount", () => {
    it("returns 0 for an empty cart", () => {
      expect(selectCartCount(useCartStore.getState())).toBe(0);
    });

    it("sums quantities across every line item", () => {
      useCartStore
        .getState()
        .addItem(createMockProduct({ id: 1, stock: 10 }), 2);
      useCartStore
        .getState()
        .addItem(createMockProduct({ id: 2, stock: 10 }), 3);

      expect(selectCartCount(useCartStore.getState())).toBe(5);
    });
  });

  describe("selectCartSubtotal", () => {
    it("returns 0 for an empty cart", () => {
      expect(selectCartSubtotal(useCartStore.getState())).toBe(0);
    });

    it("sums discounted price times quantity across every line item", () => {
      useCartStore.getState().addItem(
        createMockProduct({
          id: 1,
          price: 100,
          discountPercentage: 50,
          stock: 10,
        }),
        2,
      );
      useCartStore
        .getState()
        .addItem(createMockProduct({ id: 2, price: 20, stock: 10 }), 1);

      // (100 * 0.5) * 2 + 20 * 1
      expect(selectCartSubtotal(useCartStore.getState())).toBe(120);
    });
  });

  describe("selectIsProductInCart", () => {
    it("returns false when the product is not in the cart", () => {
      expect(selectIsProductInCart(1)(useCartStore.getState())).toBe(false);
    });

    it("returns true once the product has been added", () => {
      useCartStore.getState().addItem(createMockProduct({ id: 1 }), 1);

      expect(selectIsProductInCart(1)(useCartStore.getState())).toBe(true);
    });

    it("returns false again after the product is removed", () => {
      useCartStore.getState().addItem(createMockProduct({ id: 1 }), 1);
      useCartStore.getState().removeItem(1);

      expect(selectIsProductInCart(1)(useCartStore.getState())).toBe(false);
    });
  });

  describe("clampQuantity and zero stock", () => {
    it("rejects adding a product with zero stock", () => {
      const outOfStock = createMockProduct({ id: 99, stock: 0 });
      useCartStore.getState().addItem(outOfStock, 1);

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("rejects adding a product with negative stock", () => {
      const negativeStock = createMockProduct({ id: 99, stock: -2 });
      useCartStore.getState().addItem(negativeStock, 1);

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("persist merge and migration", () => {
    const options = useCartStore.persist.getOptions();

    it("has persist version 1", () => {
      expect(options.version).toBe(1);
    });

    it("safely merges malformed persisted states to empty items", () => {
      const currentState = useCartStore.getState();
      const merge = options.merge!;

      expect(merge(null, currentState)).toEqual(
        expect.objectContaining({ items: [] }),
      );
      expect(merge("invalid-json", currentState)).toEqual(
        expect.objectContaining({ items: [] }),
      );
      expect(merge({ items: "not-an-array" }, currentState)).toEqual(
        expect.objectContaining({ items: [] }),
      );
    });

    it("filters out invalid/corrupted cart items on merge", () => {
      const currentState = useCartStore.getState();
      const merge = options.merge!;

      const result = merge(
        {
          items: [
            {
              id: 1,
              title: "Valid",
              thumbnail: "img.jpg",
              price: 10,
              stock: 5,
              quantity: 1,
            },
            { id: "invalid-id", title: "Bad Item" },
            null,
            { id: 2, title: "Negative Price", price: -10, stock: 5, quantity: 1 },
            { id: 3, title: "Zero Qty", price: 10, stock: 5, quantity: 0 },
          ],
        },
        currentState,
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(1);
    });

    it("migrates from version 0 by filtering valid items", () => {
      const migrate = options.migrate!;
      const stateV0 = {
        items: [
          {
            id: 1,
            title: "Migrated Item",
            thumbnail: "img.jpg",
            price: 25,
            stock: 10,
            quantity: 2,
          },
          { id: "corrupt" },
        ],
      };

      const migrated = migrate(stateV0, 0) as CartState;
      expect(migrated.items).toHaveLength(1);
      expect(migrated.items[0].title).toBe("Migrated Item");
    });
  });
});
