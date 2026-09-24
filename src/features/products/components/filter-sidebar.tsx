import type { ReactNode } from "react";

import { RadioGroup, RadioOption } from "@/components/ui/radio";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductCategory } from "@/features/products/types/product.types";

import { SORT_OPTIONS } from "../constants/sort-options";
import { PriceRangeFilter } from "./price-range-filter";

interface FilterSectionProps {
  title: string;
  hint?: string;
  children: ReactNode;
}

const FilterSection = ({ title, hint, children }: FilterSectionProps) => (
  <section className="flex flex-col gap-3">
    <div>
      <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {title}
      </h3>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
    {children}
  </section>
);

interface FilterSidebarProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  categories?: ProductCategory[];
  categoriesLoading: boolean;
}

export const FilterSidebar = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  categories,
  categoriesLoading,
}: FilterSidebarProps) => (
  <div className="flex flex-col gap-5">
    <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-col lg:gap-5">
      <FilterSection title="Search">
        <SearchInput
          placeholder="Search products..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Search products"
        />
      </FilterSection>

      <Separator className="hidden lg:block" />

      <FilterSection title="Sort by">
        <Select
          value={sort}
          options={SORT_OPTIONS}
          onValueChange={onSortChange}
          aria-label="Sort products"
        />
      </FilterSection>
    </div>

    <Separator />

    <FilterSection title="Price range" hint="Narrows the products shown.">
      <PriceRangeFilter
        min={minPrice}
        max={maxPrice}
        onMinChange={onMinPriceChange}
        onMaxChange={onMaxPriceChange}
      />
    </FilterSection>

    <Separator />

    <FilterSection
      title="Category"
      hint={
        search
          ? "Search covers every category. Pick one to browse it."
          : undefined
      }
    >
      {categoriesLoading ? (
        <div className="-mx-1 flex max-h-56 flex-col gap-2 overflow-y-auto px-1 lg:max-h-104">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-9 w-full shrink-0" />
          ))}
        </div>
      ) : (
        <RadioGroup
          label="Category"
          className="-mx-1 flex max-h-56 flex-col gap-0.5 overflow-y-auto px-1 lg:max-h-104"
        >
          <RadioOption
            label="All products"
            selected={!category && !search}
            onSelect={() => onCategoryChange("")}
          />
          {(categories ?? []).map((item) => (
            <RadioOption
              key={item.slug}
              label={item.name}
              selected={item.slug === category}
              onSelect={() => onCategoryChange(item.slug)}
            />
          ))}
        </RadioGroup>
      )}
    </FilterSection>
  </div>
);
