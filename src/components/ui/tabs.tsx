"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { Button } from "./button";

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  className?: string;
}

export const Tabs = ({ items, className }: TabsProps) => {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const step =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const nextIndex = (index + step + items.length) % items.length;
    setActiveId(items[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1"
      >
        {items.map((item, index) => {
          const selected = item.id === activeId;
          return (
            <Button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              variant="ghost"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "flex-1 shrink-0 whitespace-nowrap",
                selected
                  ? "bg-white text-slate-900 shadow-sm hover:bg-white"
                  : "text-slate-500 hover:bg-transparent hover:text-slate-800",
              )}
            >
              {item.label}
            </Button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="pt-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};
