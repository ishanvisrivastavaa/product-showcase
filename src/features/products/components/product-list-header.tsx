interface ProductListHeaderProps {
  heading: string;
  resultLabel: string;
}

export const ProductListHeader = ({
  heading,
  resultLabel,
}: ProductListHeaderProps) => (
  <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-800 px-6 py-8 shadow-lg shadow-indigo-950/20 sm:px-8 sm:py-10">
    <p className="text-xs font-semibold tracking-widest text-indigo-300 uppercase">
      Catalog
    </p>
    <h1 className="mt-2 truncate text-3xl font-bold tracking-tight text-white sm:text-4xl">
      {heading}
    </h1>
    <p className="mt-2 text-sm text-indigo-100/80" aria-live="polite">
      {resultLabel}
    </p>
  </header>
);
