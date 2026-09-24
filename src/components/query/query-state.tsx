import type { ReactNode } from "react";

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  loadingFallback: ReactNode;
  errorFallback: ReactNode;
  emptyFallback: ReactNode;
  children: ReactNode;
}

export const QueryState = ({
  isLoading,
  isError,
  isEmpty,
  loadingFallback,
  errorFallback,
  emptyFallback,
  children,
}: QueryStateProps) => {
  if (isError) {
    return <>{errorFallback}</>;
  }

  if (isLoading) {
    return <>{loadingFallback}</>;
  }

  if (isEmpty) {
    return <>{emptyFallback}</>;
  }

  return <>{children}</>;
};
