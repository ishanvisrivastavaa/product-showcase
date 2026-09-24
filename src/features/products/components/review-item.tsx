import { memo } from "react";

import type { ProductReview } from "@/features/products/types/product.types";

import { ProductRating } from "./product-rating";

const formatReviewDate = (date: string): string =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

interface ReviewItemProps {
  review: ProductReview;
}

export const ReviewItem = memo(function ReviewItem({
  review,
}: ReviewItemProps) {
  return (
    <li className="flex gap-4 rounded-xl bg-slate-50 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
        {getInitials(review.reviewerName)}
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="text-sm font-semibold text-slate-900">
            {review.reviewerName}
          </p>
          <span className="text-xs text-slate-400">
            {formatReviewDate(review.date)}
          </span>
        </div>
        <ProductRating rating={review.rating} />
        <p className="text-sm leading-relaxed text-slate-600">
          {review.comment}
        </p>
      </div>
    </li>
  );
});
