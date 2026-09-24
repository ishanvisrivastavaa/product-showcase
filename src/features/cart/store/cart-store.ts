import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getDiscountedPrice } from "@/lib/format/number";
import type { Product } from "@/features/products/types/product.types";
import type { CartItem } from "../types/cart.types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
}

const clampQuantity = (quantity: number, stock: number) =>
  Math.min(Math.max(1, quantity), Math.max(1, stock));

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
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
            price: getDiscountedPrice(
              product.price,
              product.discountPercentage,
            ),
            stock: product.stock,
            quantity: clampQuantity(quantity, product.stock),
          };
          return { items: [...state.items, item] };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: clampQuantity(quantity, item.stock) }
              : item,
          ),
        })),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "product-showcase-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectIsProductInCart = (id: number) => (state: CartState) =>
  state.items.some((item) => item.id === id);
