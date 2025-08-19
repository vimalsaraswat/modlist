export const formatCompactNumber = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);

export const formatCurrency = (value = 0, currency = "INR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(value);
