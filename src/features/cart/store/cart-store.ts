import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getDiscountedPrice } from "@/lib/format/number";
import type { Product } from "@/features/products/types/product.types";
import type { CartItem } from "../types/cart.types";

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

export const isCartItem = (item: unknown): item is CartItem => {
  if (!item || typeof item !== "object") return false;
  const c = item as Record<string, unknown>;
  return (
    typeof c.id === "number" &&
    Number.isInteger(c.id) &&
    c.id > 0 &&
    typeof c.title === "string" &&
    typeof c.thumbnail === "string" &&
    typeof c.price === "number" &&
    Number.isFinite(c.price) &&
    c.price >= 0 &&
    typeof c.stock === "number" &&
    Number.isInteger(c.stock) &&
    c.stock >= 0 &&
    typeof c.quantity === "number" &&
    Number.isInteger(c.quantity) &&
    c.quantity > 0
  );
};

export const clampQuantity = (quantity: number, stock: number): number => {
  if (stock <= 0) return 0;
  return Math.min(Math.max(1, quantity), stock);
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity) =>
        set((state) => {
          if (product.stock <= 0) return state;
          const clamped = clampQuantity(quantity, product.stock);
          if (clamped <= 0) return state;

          const itemPrice = getDiscountedPrice(
            product.price,
            product.discountPercentage,
          );

          const currentTotal = state.items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
          );

          const existing = state.items.find((item) => item.id === product.id);

          const additionalQuantity = existing
            ? clampQuantity(existing.quantity + quantity, existing.stock) - existing.quantity
            : clamped;

          if (currentTotal + itemPrice * additionalQuantity > 500) return state;

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                    ...item,
                    quantity: clampQuantity(
                      item.quantity + quantity,
                      item.stock,
                    ),
                  }
                  : item,
              ),
            };
          }
          const item: CartItem = {
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: itemPrice,
            stock: product.stock,
            quantity: clamped,
          };
          return { items: [...state.items, item] };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id !== id) return item;
              const nextQuantity = clampQuantity(quantity, item.stock);

              const otherTotal = state.items
                .filter((i) => i.id !== id)
                .reduce((sum, i) => sum + i.price * i.quantity, 0)

              if (otherTotal + item.price * nextQuantity > 500) return true

              return nextQuantity > 0
                ? { ...item, quantity: nextQuantity }
                : null;
            })
            .filter((item): item is CartItem => item !== null),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "product-showcase-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      migrate: (persistedState: unknown, version: number): CartState => {
        if (version === 0) {
          if (!persistedState || typeof persistedState !== "object") {
            return { items: [] } as unknown as CartState;
          }
          const state = persistedState as { items?: unknown };
          return {
            ...(state as object),
            items: Array.isArray(state.items)
              ? state.items.filter(isCartItem)
              : [],
          } as CartState;
        }
        return persistedState as CartState;
      },
      merge: (persistedState: unknown, currentState: CartState): CartState => {
        if (!persistedState || typeof persistedState !== "object") {
          return { ...currentState, items: [] };
        }
        const state = persistedState as { items?: unknown };
        if (!Array.isArray(state.items)) {
          return { ...currentState, items: [] };
        }
        return {
          ...currentState,
          items: state.items.filter(isCartItem),
        };
      },
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  Math.round(
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100,
  ) / 100;

export const selectIsProductInCart = (id: number) => (state: CartState) =>
  state.items.some((item) => item.id === id);
