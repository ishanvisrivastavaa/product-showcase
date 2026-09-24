import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { SearchXIcon } from "@/components/ui/icons";

const NotFoundPage = () => (
  <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
      <SearchXIcon className="h-7 w-7" />
    </span>
    <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
      404
    </p>
    <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
    <p className="max-w-md text-sm text-slate-500">
      The page you are looking for does not exist or has been moved.
    </p>
    <Link href="/" className={buttonClasses({ className: "mt-2" })}>
      Back to products
    </Link>
  </div>
);

export default NotFoundPage;
