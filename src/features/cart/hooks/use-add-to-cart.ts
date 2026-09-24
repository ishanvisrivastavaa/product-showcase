import { useToast } from "@/components/ui/toast";
import type { Product } from "@/features/products/types/product.types";

import { useCartStore } from "../store/cart-store";

export const useAddToCart = () => {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToast((state) => state.showToast);

  return (product: Product, quantity: number) => {
    addItem(product, quantity);
    showToast({
      message:
        quantity > 1
          ? `${quantity} × ${product.title} added to cart`
          : `${product.title} added to cart`,
      link: { href: "/cart", label: "View cart" },
    });
  };
};
