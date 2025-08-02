export function formatDate(
  date: Date | string,
  locale = "en-IN",
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  },
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals: {
    limit: number;
    divisor: number;
    unit: Intl.RelativeTimeFormatUnit;
  }[] = [
    { limit: 60, divisor: 1, unit: "second" },
    { limit: 3600, divisor: 60, unit: "minute" },
    { limit: 86400, divisor: 3600, unit: "hour" },
    { limit: 604800, divisor: 86400, unit: "day" },
    { limit: 2592000, divisor: 604800, unit: "week" },
    { limit: 31536000, divisor: 2592000, unit: "month" },
    { limit: Infinity, divisor: 31536000, unit: "year" },
  ];

  for (const interval of intervals) {
    if (seconds < interval.limit) {
      const value = Math.floor(seconds / interval.divisor);
      return rtf.format(-value, interval.unit);
    }
  }

  return "just now";
}
