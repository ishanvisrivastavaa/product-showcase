import { twMerge } from "tailwind-merge";

export const cn = (
  ...parts: Array<string | false | null | undefined>
): string => twMerge(parts.filter(Boolean).join(" "));
