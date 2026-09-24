export interface ProductFilterState {
  search: string;
  category: string;
  sort: string;
  page: number;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}
