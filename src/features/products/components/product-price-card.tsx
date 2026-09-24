import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice, getDiscountedPrice } from "@/lib/format/number";
import { cn } from "@/lib/utils/cn";
import { AddToCart } from "@/features/cart";
import type { Product } from "@/features/products/types/product.types";

import {
  availabilityDotClasses,
  getAvailabilityVariant,
} from "../utils/availability";

interface ProductPriceCardProps {
  product: Product;
  categoryName: string;
  categoryHref: string;
}

export const ProductPriceCard = ({
  product,
  categoryName,
  categoryHref,
}: ProductPriceCardProps) => {
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage,
  );
  const hasDiscount = product.discountPercentage >= 1;

  return (
    <Card className="flex flex-col gap-5 border-t-4 border-t-indigo-600 p-6 sm:p-8">
      <div className="flex flex-wrap items-end gap-3">
        <span className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {formatPrice(discountedPrice)}
        </span>
        {hasDiscount ? (
          <>
            <span className="pb-1 text-lg text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
            <Badge variant="success" className="mb-1.5">
              Save {product.discountPercentage.toFixed(0)}%
            </Badge>
          </>
        ) : null}
      </div>
      <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            availabilityDotClasses[
              getAvailabilityVariant(product.availabilityStatus)
            ],
          )}
        />
        <span className="font-semibold text-slate-900">
          {product.availabilityStatus}
        </span>
        · {product.stock} in stock
      </p>
      <AddToCart product={product} />
      <Link
        href={categoryHref}
        className={buttonClasses({
          variant: "secondary",
          size: "lg",
          className: "w-full",
        })}
      >
        More from {categoryName}
      </Link>
    </Card>
  );
};
