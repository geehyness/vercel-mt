// lib/utils.ts
export function formatYearWeekDisplay(yearWeek: string): string {
    const year = yearWeek.substring(0, 4);
    const week = yearWeek.substring(5);
    return `Year ${year}, Week ${week}`;
  }
  
  export function truncateText(text: string | undefined | null, maxLength: number = 512): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  export function extractYearFromYearWeek(yearWeek: string): string {
    return yearWeek.substring(0, 4);
  }