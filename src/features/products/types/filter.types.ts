export interface ProductFilterState {
  search: string;
  category: string;
  sort: string;
  page: number;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}
