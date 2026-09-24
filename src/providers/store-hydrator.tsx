"use client";

import { useEffect } from "react";

import { useCartStore } from "@/features/cart/store/cart-store";

export const StoreHydrator = () => {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  return null;
};
