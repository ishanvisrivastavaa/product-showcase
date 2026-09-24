import Link from "next/link";

import { siteConfig } from "@/config/site.config";
import { CartBadge } from "@/features/cart";

import { ShoppingBagIcon } from "../ui/icons";

export const Header = () => (
  <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-lg focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <ShoppingBagIcon className="h-4.5 w-4.5" />
        </span>
        <span className="text-lg font-semibold tracking-tight text-slate-900">
          {siteConfig.name}
        </span>
      </Link>

      <CartBadge />
    </div>
  </header>
);
