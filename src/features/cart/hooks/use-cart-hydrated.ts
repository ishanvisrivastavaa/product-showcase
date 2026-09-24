"use client";

import { useSyncExternalStore } from "react";

import { useCartStore } from "../store/cart-store";

const subscribe = (callback: () => void) => {
  return useCartStore.persist.onFinishHydration(callback);
};

const getSnapshot = () => useCartStore.persist.hasHydrated();

const getServerSnapshot = () => false;

export const useCartHydrated = (): boolean => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
