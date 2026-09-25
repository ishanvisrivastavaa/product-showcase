import { useToast } from "@/components/ui/toast";
import type { Product } from "@/features/products/types/product.types";

import { useCartStore } from "../store/cart-store";
import { getDiscountedPrice } from "@/lib/format/number";

export const useAddToCart = () => {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToast((state) => state.showToast);

  return (product: Product, quantity: number) => {
    const currentTotal = useCartStore
      .getState()
      .items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const itemPrice = getDiscountedPrice(
      product.price,
      product.discountPercentage,
    )
    console.log("itemPrice", itemPrice)
    console.log("currentTotal", currentTotal)
    console.log("quantity", quantity)
    if (currentTotal + itemPrice * quantity > 500) {
      showToast({
        message: "Cart Total can not exceed 500"
      })
      return;
    }
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
