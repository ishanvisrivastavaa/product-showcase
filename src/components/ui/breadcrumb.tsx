import Link from "next/link";
import type { ReactNode } from "react";

import { ChevronRightIcon } from "./icons";

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => (
  <nav aria-label="Breadcrumb" className={className}>
    <ol className="flex min-w-0 items-center gap-1.5 text-sm text-slate-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li
            key={index}
            className={isLast ? "min-w-0 truncate" : "flex shrink-0 items-center gap-1.5"}
          >
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="rounded transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? "truncate font-medium text-slate-900" : undefined}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast ? (
              <ChevronRightIcon
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-slate-300"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  </nav>
);
