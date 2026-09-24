import { siteConfig } from "@/config/site.config";

export const Footer = () => (
  <footer className="mt-16 border-t border-slate-200/80 bg-white/70">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-medium text-slate-900">{siteConfig.name}</p>
      <p className="text-xs text-slate-500">
        Data provided by DummyJSON · {new Date().getFullYear()}
      </p>
    </div>
  </footer>
);
