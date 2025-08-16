const SECONDS_IN_MS = 1000;
const MINUTES_IN_MS = 60 * SECONDS_IN_MS;
const HOURS_IN_MS = 60 * MINUTES_IN_MS;
const DAYS_IN_MS = 24 * HOURS_IN_MS;

const AVG_DAYS_PER_MONTH = 30.436875; // 365.2425 days / 12 months
const AVG_DAYS_PER_YEAR = 365.2425;

const MONTHS_IN_MS_APPROX = AVG_DAYS_PER_MONTH * DAYS_IN_MS;
const YEARS_IN_MS_APPROX = AVG_DAYS_PER_YEAR * DAYS_IN_MS;

export const formatDistanceToNow = (
  date: Date,
  options?: { addSuffix?: boolean },
) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime(); // Positive if date is in the past, negative if in the future
  const absDiff = Math.abs(diff);

  const addSuffix = options?.addSuffix ?? true; // Default to true as per typical usage
  const isPast = diff > 0;
  let suffix = "";

  if (addSuffix) {
    suffix = isPast ? " ago" : " from now";
  }

  if (absDiff < 45 * SECONDS_IN_MS) {
    // Less than 45 seconds
    return `less than a minute${suffix}`;
  } else if (absDiff < 90 * SECONDS_IN_MS) {
    // 45 seconds to 1.5 minutes
    return `1 minute${suffix}`;
  } else if (absDiff < 45 * MINUTES_IN_MS) {
    // 1.5 minutes to 45 minutes
    const minutes = Math.round(absDiff / MINUTES_IN_MS);
    return `${minutes} minutes${suffix}`;
  } else if (absDiff < 90 * MINUTES_IN_MS) {
    // 45 minutes to 1.5 hours
    return `1 hour${suffix}`;
  } else if (absDiff < 24 * HOURS_IN_MS) {
    // 1.5 hours to 24 hours
    const hours = Math.round(absDiff / HOURS_IN_MS);
    return `${hours} hours${suffix}`;
  } else if (absDiff < 48 * HOURS_IN_MS) {
    // 24 hours to 48 hours
    return `1 day${suffix}`;
  } else if (absDiff < 30 * DAYS_IN_MS) {
    // 2 days to approx 30 days
    const days = Math.round(absDiff / DAYS_IN_MS);
    return `${days} days${suffix}`;
  } else if (absDiff < 60 * DAYS_IN_MS) {
    // Approx 30 days to 60 days
    return `1 month${suffix}`;
  } else if (absDiff < YEARS_IN_MS_APPROX) {
    // Approx 60 days to 1 year
    const months = Math.round(absDiff / MONTHS_IN_MS_APPROX);
    return `${months} months${suffix}`;
  } else if (absDiff < 2 * YEARS_IN_MS_APPROX) {
    // Approx 1 year to 2 years
    return `1 year${suffix}`;
  } else {
    // More than approx 2 years
    const years = Math.round(absDiff / YEARS_IN_MS_APPROX);
    return `${years} years${suffix}`;
  }
};

export const formatDateLabel = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
