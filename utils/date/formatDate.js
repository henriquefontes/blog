/**
 * Format a date object to pt-BR string format.
 * Returns null if date is invalid.
 *
 * @param {Date | string | number} date
 * @returns {string | null}
 */
export default function formatDate(date) {
  if (!date) return null;

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return date
    ? new Intl.DateTimeFormat("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
      }).format(date)
    : null;
}
