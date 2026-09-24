import { Button } from "./button";
import { XIcon } from "./icons";

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export const FilterChip = ({ label, value, onRemove }: FilterChipProps) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 py-1.5 pr-1.5 pl-3 text-xs font-medium text-indigo-700">
    <span className="text-indigo-500">{label}:</span>
    <span className="max-w-40 truncate">{value}</span>
    <Button
      variant="ghost"
      size="icon"
      onClick={onRemove}
      aria-label={`Remove ${label.toLowerCase()} filter`}
      className="h-5 w-5 rounded-full text-indigo-500 hover:bg-indigo-600 hover:text-white"
    >
      <XIcon className="h-3 w-3" />
    </Button>
  </span>
);
