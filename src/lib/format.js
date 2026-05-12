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
