export const availabilityDotClasses = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
} as const;

type AvailabilityVariant = "success" | "warning" | "danger";

export const getAvailabilityVariant = (
  availabilityStatus: string,
): AvailabilityVariant => {
  const status = availabilityStatus.toLowerCase();
  if (status.includes("out")) return "danger";
  if (status.includes("low")) return "warning";
  return "success";
};
