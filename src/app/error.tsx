"use client";

import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "@/components/ui/icons";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => (
  <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
      <AlertCircleIcon className="h-7 w-7" />
    </span>
    <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
    <p className="max-w-md text-sm text-slate-500">
      An unexpected error occurred while loading this page. Please try again.
    </p>
    {error.digest ? (
      <p className="font-mono text-xs text-slate-400">
        Error ID: {error.digest}
      </p>
    ) : null}
    <Button onClick={reset} className="mt-2">
      Try again
    </Button>
  </div>
);

export default ErrorPage;
