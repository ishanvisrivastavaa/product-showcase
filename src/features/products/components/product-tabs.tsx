import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { formatSlug } from "@/lib/format/text";
import type { Product } from "@/features/products/types/product.types";

import { ReviewItem } from "./review-item";

interface ProductTabsProps {
  product: Product;
}

const getSpecs = (product: Product): Array<[string, string]> => [
  ["Brand", product.brand || "—"],
  ["Category", formatSlug(product.category)],
  ["SKU", product.sku],
  ["Weight", `${product.weight} g`],
  [
    "Dimensions",
    `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`,
  ],
  ["Minimum order", `${product.minimumOrderQuantity} units`],
  ["Barcode", product.meta.barcode],
];

export const ProductTabs = ({ product }: ProductTabsProps) => (
  <Card className="p-5 sm:p-6">
    <Tabs
      items={[
        {
          id: "description",
          label: "Description",
          content: (
            <div className="flex flex-col gap-4">
              <p className="text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>
              {product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </div>
          ),
        },
        {
          id: "specs",
          label: "Specifications",
          content: (
            <dl className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
              {getSpecs(product).map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[8rem_1fr] gap-4 px-4 py-3 text-sm odd:bg-slate-50"
                >
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-medium break-words text-slate-900">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          ),
        },
        {
          id: "reviews",
          label: `Reviews (${product.reviews.length})`,
          content:
            product.reviews.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {product.reviews.map((review) => (
                  <ReviewItem
                    key={`${review.reviewerEmail}-${review.date}`}
                    review={review}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No reviews yet.</p>
            ),
        },
      ]}
    />
  </Card>
);
