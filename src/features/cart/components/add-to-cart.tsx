"use client";

import { useState } from "react";

import { QuantitySelector } from "@/components/ui/quantity-selector";
import type { Product } from "@/features/products/types/product.types";

import { AddToCartButton } from "./add-to-cart-button";

interface AddToCartProps {
  product: Product;
}

export const AddToCart = ({ product }: AddToCartProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
      <AddToCartButton product={product} quantity={quantity} className="flex-1" />
    </div>
  );
};
