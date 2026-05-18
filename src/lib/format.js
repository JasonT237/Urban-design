export function formatXAF(amount) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "0 XAF";
  return `${amount.toLocaleString()} XAF`;
}

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (end <= start) return 0;

  return (end - start) / (1000 * 60 * 60 * 24);
}

export function formatShortDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function capitalize(value) {
  if (!value || typeof value !== "string") return value || "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
