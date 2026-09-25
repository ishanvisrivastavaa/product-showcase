"use client";

import Image from "next/image";
import Link from "next/link";

import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBagIcon, XIcon } from "@/components/ui/icons";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format/number";

import { useCartHydrated } from "../hooks/use-cart-hydrated";
import {
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
} from "../store/cart-store";
import type { CartItem } from "../types/cart.types";
import { useState } from "react";


const CartLine = ({ item }: { item: CartItem }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="flex gap-4 py-5 first:pt-0 last:pb-0">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${item.id}`}
              className="line-clamp-2 rounded font-semibold text-slate-900 hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
              {item.title}
            </Link>
            <p className="mt-0.5 text-sm text-slate-500">
              {formatPrice(item.price)} each
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.title} from cart`}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-3">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            onChange={(quantity) => updateQuantity(item.id, quantity)}
            max={item.stock}
            label={`Quantity for ${item.title}`}
          />
          <p className="font-semibold text-slate-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </li>
  );
};

export const CartView = () => {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [couponCode, setCouponCode] = useState("");
  const [discountType, setDiscountType] = useState<
    "CUSTOMER15" | "flat10" | "NEW100" | "SUMMER20" | "OFFER150" | null
  >(null);
  console.log("couponCode", couponCode)

  const discount = discountType === "flat10"
    ? Math.round(subtotal * 0.1)
    : discountType === "CUSTOMER15"
      ? Math.round(subtotal * 0.15)
      : discountType === "NEW100"
        ? 100
        : discountType === "SUMMER20"
          ? Math.round(subtotal * 0.2)
          : discountType === "OFFER150"
            ? 150
            : 0

  console.log("discountType", discountType)
  const total = Math.max(0, Math.round(subtotal - discount))
  console.log("total", total)

  const applyCoupon = (code?: string) => {
    console.log("code", code)

    if (code === "flat10") {
      setDiscountType("flat10")
      // setCouponCode("flat10")
    }
    else if (code === "CUSTOMER15") {
      setDiscountType("CUSTOMER15")
      // setCouponCode("CUSTOMER15")
    }
    else if (code === "NEW100") {
      setDiscountType("NEW100")
      // setCouponCode("NEW100")
    }
    else if (code === "SUMMER20") {
      setDiscountType("SUMMER20")
      // setCouponCode("SUMMER20")
    }
    else if (code === "OFFER150") {
      setDiscountType("OFFER150")
      // setCouponCode("OFFER150")
    }
  }

  if (!hydrated) {
    return (
      <div
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
        data-testid="cart-skeleton"
      >
        <Card className="p-5 sm:p-6">
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </Card>
        <Card className="flex h-fit flex-col gap-4 p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBagIcon className="h-6 w-6" />}
        title="Your cart is empty"
        description="Browse the catalog and add a few products to get started."
        action={
          <Link href="/" className={buttonClasses()}>
            Browse products
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <Card className="p-5 sm:p-6">
        <ul className="flex flex-col divide-y divide-slate-100">
          {items?.map((item) => (
            <CartLine key={item.id} item={item} />
          ))}
        </ul>
      </Card>

      <Card className="flex h-fit flex-col gap-4 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Items</dt>
            <dd className="font-medium text-slate-900">{count}</dd>
          </div>

          {/* CUSTOMER15 -- 15% 
FREE10 -- 10%
NEW100 -- Rs.100
OFFER150 -- Rs. 150
SUMMER20 -- 20% */}


          <div className="flex justify-between border-t border-slate-100 pt-3">
            <input
              type="text"
              placeholder="Coupon Code"
              className="w-full rounded-lg-border"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button variant="secondary" size="sm" type="button" onClick={() => applyCoupon(couponCode)}>Apply</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => { setCouponCode("flat10"); applyCoupon("flat10"); }}>FREE10 -- 10%</Button>
            <Button variant="secondary" size="sm" type="button" onClick={() => { setCouponCode("NEW100"); applyCoupon("NEW100"); }}>NEW100 -- Rs.100</Button>
            <Button variant="secondary" size="sm" type="button" onClick={() => { setCouponCode("CUSTOMER15"); applyCoupon("CUSTOMER15"); }}>CUSTOMER15 -- 15%</Button>
            <Button variant="secondary" size="sm" type="button" onClick={() => { setCouponCode("SUMMER20"); applyCoupon("SUMMER20"); }}>SUMMER20 -- 20% </Button>
          </div>


          <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
            <dt className="font-semibold text-slate-900">Subtotal</dt>
            <dd className="font-bold text-slate-900" aria-live="polite">
              {formatPrice(subtotal)}
            </dd>
          </div>

          <div className="flex justify-between border-t border-slate-100 pt-3 text-base">
            <dt className="font-semibold text-slate-900">Total</dt>
            <dd className="font-bold text-slate-900" aria-live="polite">
              {formatPrice(total)}
            </dd>
          </div>
        </dl>
        <Link href="/" className={buttonClasses({ variant: "secondary" })}>
          Continue shopping
        </Link>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear cart
        </Button>
      </Card>
    </div>
  );
};
