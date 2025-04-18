/**
 * Formats yearWeek string (e.g., "2023-W05") to display format
 */
export function formatYearWeekDisplay(yearWeek: string): string {
  if (!yearWeek || yearWeek.length < 7) return '';
  return `Year ${yearWeek.substring(0, 4)}, Week ${yearWeek.substring(6)}`;
}

/**
 * Truncates text with ellipsis if exceeds maxLength
 */
export function truncateText(text: string | undefined | null, maxLength: number = 120): string {
  if (!text) return '';
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
}

/**
 * Extracts year from yearWeek string
 */
export function extractYearFromYearWeek(yearWeek: string): string {
  return yearWeek?.substring(0, 4) || '';
}