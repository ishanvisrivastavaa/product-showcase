"use client";

import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { ShoppingBagIcon } from "@/components/ui/icons";

import { useCartHydrated } from "../hooks/use-cart-hydrated";
import { selectCartCount, useCartStore } from "../store/cart-store";

export const CartBadge = () => {
  const hydrated = useCartHydrated();
  const count = useCartStore(selectCartCount);

  return (
    <Link
      href="/cart"
      aria-label={
        hydrated
          ? `Cart, ${count} ${count === 1 ? "item" : "items"}`
          : "Cart, 0 items"
      }
      className={buttonClasses({
        variant: "ghost",
        className: "relative px-3",
      })}
    >
      <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">Cart</span>
      {hydrated && count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-semibold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
};
