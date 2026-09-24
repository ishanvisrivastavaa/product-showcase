"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";

interface UseDebouncedUrlParamOptions {
  value: string;
  onUpdate: (value: string) => void;
  delay?: number;
}

export const useDebouncedUrlParam = ({
  value,
  onUpdate,
  delay = 400,
}: UseDebouncedUrlParamOptions) => {
  const [input, setInput] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setInput(value);
  }

  const debounced = useDebounce(input.trim(), delay);

  useEffect(() => {
    const settled = debounced === input.trim();
    if (!settled || debounced === value) return;
    onUpdate(debounced);
  }, [debounced, input, value, onUpdate]);

  return [input, setInput] as const;
};
