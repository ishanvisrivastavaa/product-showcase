import { memo } from "react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AddToCartButton } from "@/features/cart";
import { formatPrice, getDiscountedPrice } from "@/lib/format/number";
import { formatSlug } from "@/lib/format/text";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/features/products/types/product.types";

import {
  availabilityDotClasses,
  getAvailabilityVariant,
} from "../utils/availability";
import { ProductRating } from "./product-rating";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({
  product,
}: ProductCardProps) {
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage,
  );
  const hasDiscount = product.discountPercentage >= 1;
  const availability = getAvailabilityVariant(product.availabilityStatus);

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/[0.08] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-indigo-500 has-[a:focus-visible]:ring-offset-2">
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
        {hasDiscount ? (
          <Badge variant="danger" className="absolute top-3 left-3 z-10">
            -{product.discountPercentage.toFixed(0)}%
          </Badge>
        ) : null}
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          loading="lazy"
          sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-contain p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Badge variant="outline" className="w-fit">
          {product.brand || formatSlug(product.category)}
        </Badge>

        <h3 className="line-clamp-2 min-h-[2.75rem] text-base leading-snug font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
          <Link
            href={`/product/${product.id}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {product.title}
          </Link>
        </h3>

        <div className="flex items-center justify-between gap-2">
          <ProductRating
            rating={product.rating}
            reviewCount={product.reviews.length}
          />
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                availabilityDotClasses[availability],
              )}
            />
            {product.availabilityStatus}
          </span>
        </div>

        <Separator className="mt-auto" />

        <div className="flex items-end justify-between gap-3 pt-1">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900">
              {formatPrice(discountedPrice)}
            </span>
            {hasDiscount ? (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>
          <AddToCartButton
            product={product}
            compact
            className="relative z-10"
          />
        </div>
      </div>
    </Card>
  );
});
