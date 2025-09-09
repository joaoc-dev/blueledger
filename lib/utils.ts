import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { eachDayOfInterval, endOfDay, getDay, isValid, parseISO, startOfDay } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { DAY_NAMES_ARRAY } from '@/features/dashboard/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a localized string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatLocalizedDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(parsedDate))
    return '—';

  const formatter = new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatter.format(parsedDate);
}

/**
 * Formats an hour number to HH:00 format
 * @param hour - Hour number (0-23)
 * @returns Formatted hour string like "14:00"
 */
export function formatHour(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`;
}

/**
 * Counts how many times each day of the week occurs within a date range.
 * Processes all days in a single pass for maximum efficiency.
 *
 * @param startDate - Start of the range
 * @param endDate - End of the range
 * @returns Object mapping day names to their occurrence counts
 */
export function countAllDayOccurrencesInRange(startDate: Date, endDate: Date): Record<string, number> {
  // Get all days in the range using date-fns
  const daysInRange = eachDayOfInterval({
    start: startOfDay(startDate),
    end: endOfDay(endDate),
  });

  // Initialize counts for all days
  const dayCounts: Record<string, number> = {};
  DAY_NAMES_ARRAY.forEach((day) => {
    dayCounts[day] = 0;
  });

  // Count occurrences for each day
  daysInRange.forEach((day) => {
    const dayIndex = getDay(day);
    const dayName = DAY_NAMES_ARRAY[dayIndex]!;
    dayCounts[dayName] = (dayCounts[dayName] ?? 0) + 1;
  });

  return dayCounts;
}
