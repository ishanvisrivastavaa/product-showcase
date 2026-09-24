import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertCircleIcon } from "@/components/ui/icons";

interface QueryErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const QueryError = ({
  title = "Something went wrong",
  message,
  onRetry,
}: QueryErrorProps) => (
  <div role="alert">
    <EmptyState
      variant="danger"
      icon={<AlertCircleIcon className="h-6 w-6" />}
      title={title}
      description={message}
      action={
        onRetry ? (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
      className="border-rose-200 bg-rose-50/40"
    />
  </div>
);
