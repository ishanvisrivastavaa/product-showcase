"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CheckIcon, ShoppingBagIcon } from "@/components/ui/icons";
import type { Product } from "@/features/products/types/product.types";

import { useAddToCart } from "../hooks/use-add-to-cart";
import { selectIsProductInCart, useCartStore } from "../store/cart-store";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  compact?: boolean;
  className?: string;
}

const ADDED_FEEDBACK_MS = 1500;

export const AddToCartButton = ({
  product,
  quantity = 1,
  compact = false,
  className,
}: AddToCartButtonProps) => {
  const addToCart = useAddToCart();
  const isInCart = useCartStore(selectIsProductInCart(product.id));
  const [justAdded, setJustAdded] = useState(false);
  const inStock = product.stock > 0;

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const showAdded = compact ? isInCart : justAdded;

  return (
    <Button
      size={compact ? "sm" : "lg"}
      className={className}
      disabled={!inStock}
      onClick={() => {
        addToCart(product, quantity);
        setJustAdded(true);
      }}
      aria-label={
        compact
          ? inStock
            ? showAdded
              ? `Added ${product.title} to cart`
              : `Add ${product.title} to cart`
            : `${product.title} is sold out`
          : undefined
      }
    >
      {showAdded ? (
        <CheckIcon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      ) : (
        <ShoppingBagIcon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      )}
      {inStock
        ? showAdded
          ? "Added to cart"
          : "Add to cart"
        : compact
          ? "Sold out"
          : "Out of stock"}
    </Button>
  );
};
