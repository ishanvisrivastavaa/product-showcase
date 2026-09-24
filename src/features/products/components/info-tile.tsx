import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

interface InfoTileProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export const InfoTile = ({ icon, label, value }: InfoTileProps) => (
  <li>
    <Card className="flex items-center gap-3 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </Card>
  </li>
);
