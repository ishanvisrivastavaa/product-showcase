import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/ui/filter-chip";
import type { ActiveFilter } from "../types/filter.types";

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onClearAll: () => void;
}

export const ActiveFilters = ({ filters, onClearAll }: ActiveFiltersProps) => {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          value={filter.value}
          onRemove={filter.onRemove}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-slate-500"
      >
        Clear all
      </Button>
    </div>
  );
};
