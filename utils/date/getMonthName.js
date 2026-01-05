/**
 * Return full month name representation in brazilian portuguese.
 * Returns null if date is invalid.
 *
 * @param {number} month
 * @param {number} year
 * @returns {string} monthName
 */
export default function getMonthName(month, year) {
  if (month == null || year == null) return null;

  const date = new Date(year, month);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
  }).format(date);
}
