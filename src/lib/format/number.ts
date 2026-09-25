export const formatPrice = (value: number): string =>
  value?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

export const getDiscountedPrice = (
  price: number,
  discountPercentage: number,
): number => Math.round(price * (1 - discountPercentage / 100) * 100) / 100;
