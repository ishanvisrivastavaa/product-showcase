import {
  RotateCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@/components/ui/icons";
import type { Product } from "@/features/products/types/product.types";

import { InfoTile } from "./info-tile";

interface ProductHighlightsProps {
  product: Product;
}

export const ProductHighlights = ({ product }: ProductHighlightsProps) => (
  <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
    <InfoTile
      icon={<TruckIcon className="h-4 w-4" />}
      label="Shipping"
      value={product.shippingInformation}
    />
    <InfoTile
      icon={<ShieldCheckIcon className="h-4 w-4" />}
      label="Warranty"
      value={product.warrantyInformation}
    />
    <InfoTile
      icon={<RotateCcwIcon className="h-4 w-4" />}
      label="Returns"
      value={product.returnPolicy}
    />
  </ul>
);
