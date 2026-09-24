import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { SearchXIcon } from "@/components/ui/icons";

interface QueryEmptyProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export const QueryEmpty = ({
  title = "No results found",
  description,
  action,
}: QueryEmptyProps) => (
  <EmptyState
    icon={<SearchXIcon className="h-6 w-6" />}
    title={title}
    description={description}
    action={action}
  />
);
