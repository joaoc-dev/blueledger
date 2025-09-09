import type { MonthName, SeasonLabel } from './constants';
import type {
  CategoryShareData,
  CumulativeSpendData,
  DayOfWeekData,
  HourOfDayData,
  SeasonalData,
} from './schemas';
import type { ExpenseDisplay } from '@/features/expenses/schemas';

import { eachDayOfInterval, endOfDay, startOfDay } from 'date-fns';
import { EXPENSE_CATEGORIES_VALUES } from '@/features/expenses/constants';
import { countAllDayOccurrencesInRange, formatHour } from '@/lib/utils';
import {
  DAY_NAMES_ARRAY,
  MONTH_NAMES_ARRAY,
  MONTH_TO_SEASON_LABEL,
  SEASON_LABELS,
  TIME_CONSTANTS,
} from './constants';

/**
 * Converts a list of expenses into average daily spending data by day of the week.
 * Includes ALL days in the date range (even days with no expenses).
 *
 * This function works in three steps:
 * 1. Determines the date range from earliest to latest expense date.
 * 2. Groups expenses by day of the week and calculates total spent per day type.
 * 3. Counts how many times each day of week occurs in the date range.
 * 4. Computes averages by dividing total spent by day occurrences.
 *
 * @param expenses - Array of expenses with a date and total price.
 * @returns Array of objects containing each day of the week, average daily spend.
 */
export function mapExpenseDisplayToDayOfWeekData(
  expenses: ExpenseDisplay[],
): DayOfWeekData[] {
  // Return empty array if no expenses
  if (expenses.length === 0) {
    return DAY_NAMES_ARRAY.map(day => ({ day, averageSpent: 0 }));
  }

  // Find date range
  const dates = expenses.map(exp => new Date(exp.date));
  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Group expenses by day of week using Object.groupBy
  const expensesByDayOfWeek = Object.groupBy(expenses, (expense) => {
    const dayIndex = new Date(expense.date).getDay();
    return DAY_NAMES_ARRAY[dayIndex]!;
  }) as Record<string, ExpenseDisplay[]>;

  // Get all day counts
  const dayCounts = countAllDayOccurrencesInRange(startDate, endDate);

  // Calculate total spent and day count for each day of week
  const result = DAY_NAMES_ARRAY.map((dayName) => {
    const dayExpenses = expensesByDayOfWeek[dayName] || [];
    const totalSpent = dayExpenses.reduce((sum, expense) => sum + expense.totalPrice, 0);

    const dayCount = dayCounts[dayName] ?? 0;

    return {
      day: dayName,
      averageSpent: dayCount > 0 ? totalSpent / dayCount : 0,
    };
  });

  return result;
}

/**
 * Converts a list of expenses into average spending data by hour of the day.
 * Includes ALL hours in the date range (even hours with no expenses).
 *
 * This function works in three steps:
 * 1. Determines the date range from earliest to latest expense date.
 * 2. Groups expenses by hour of the day using Object.groupBy.
 * 3. Calculates total hours in range and computes averages.
 *
 * @param expenses - Array of expenses with `date` and `totalPrice`.
 * @returns Array of objects containing each hour of the day and the average spend.
 *
 */
export function mapExpenseDisplayToHourOfDayData(
  expenses: ExpenseDisplay[],
): HourOfDayData[] {
  if (expenses.length === 0) {
    return Array.from({ length: TIME_CONSTANTS.HOURS_IN_DAY }, (_, hour) => ({
      hour: formatHour(hour),
      averageSpent: 0,
    }));
  }

  // Find date range
  const dates = expenses.map((expense) => {
    const dateValue = expense.date;
    return new Date(dateValue as string | number | Date).getTime();
  });

  const startDate = new Date(Math.min(...dates));
  const endDate = new Date(Math.max(...dates));

  // Group expenses by hour of the day using Object.groupBy
  const expensesByHour = Object.groupBy(expenses, (expense) => {
    const hour = new Date(expense.date).getHours();
    return formatHour(hour);
  }) as Record<string, ExpenseDisplay[]>;

  // Calculate total days in range
  const totalDays = eachDayOfInterval({
    start: startOfDay(startDate),
    end: endOfDay(endDate),
  }).length;

  // Calculate averages for each hour
  const result = Array.from({ length: TIME_CONSTANTS.HOURS_IN_DAY }, (_, hour) => {
    const hourKey = formatHour(hour);
    const hourExpenses = expensesByHour[hourKey] || [];
    const totalSpent = hourExpenses.reduce((sum, expense) => sum + expense.totalPrice, 0);

    return {
      hour: hourKey,
      averageSpent: totalDays > 0 ? totalSpent / totalDays : 0,
    };
  });

  return result;
}

/**
 * Converts a list of expenses into aggregated spending data by season.
 * Each season is represented by a label like "Dec–Feb", "Mar–May", etc.
 *
 * @param expenses - Array of ExpenseDisplay items with date and totalPrice
 * @returns Array of objects containing each season label, total spend, and count of expenses
 */
export function mapExpenseDisplayToSeasonalData(expenses: ExpenseDisplay[]): SeasonalData[] {
  // Group expenses by season label
  const grouped: Record<SeasonLabel, ExpenseDisplay[]> = Object.groupBy(expenses, (expense) => {
    const monthIndex = new Date(expense.date).getMonth();
    const monthName = MONTH_NAMES_ARRAY[monthIndex] as MonthName;
    const season = MONTH_TO_SEASON_LABEL[monthName]!;
    return season;
  }) as Record<SeasonLabel, ExpenseDisplay[]>;

  // Compute total spend across all seasons
  const totalSpent = expenses.reduce((sum, e) => sum + e.totalPrice, 0);

  // Map each season label to a SeasonalData object
  return SEASON_LABELS.map((season) => {
    const seasonExpenses = grouped[season] ?? [];
    const spent = seasonExpenses.reduce((sum, e) => sum + e.totalPrice, 0);
    const count = seasonExpenses.length;
    const percent = totalSpent > 0 ? ((spent / totalSpent) * 100).toFixed(1) : '0';

    return {
      season,
      spent,
      count,
      percent,
    };
  });
}

/**
 * Aggregates a list of expenses into cumulative monthly spending data for the current year (YTD).
 * Calculates total spend, count of expenses, average spend per month, and cumulative spend.
 *
 * @param expenses - Array of ExpenseDisplay items with date and totalPrice
 * @returns Array of objects containing month (YYYY-MM), total spend, count, average, and cumulative spend
 */
export function mapExpenseDisplayToCumulativeSpendYTDData(expenses: ExpenseDisplay[]): CumulativeSpendData[] {
  const currentYear = new Date().getFullYear();

  // Filter expenses for current year only
  const currentYearExpenses = expenses.filter(exp => new Date(exp.date).getFullYear() === currentYear);

  // Group by month (YYYY-MM)
  const grouped = Object.groupBy(currentYearExpenses, (expense) => {
    const date = new Date(expense.date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }) as Record<string, ExpenseDisplay[]>;

  // Sort months chronologically
  const sortedMonths = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  // Compute totals, averages, and running cumulative sum
  let runningTotal = 0;
  return sortedMonths.map(([month, monthExpenses]) => {
    const spent = monthExpenses.reduce((sum, e) => sum + e.totalPrice, 0);
    const count = monthExpenses.length;
    runningTotal += spent;

    return {
      month,
      spent,
      count,
      avg: count > 0 ? spent / count : 0,
      cumulative: runningTotal,
    };
  });
}

/**
 * Converts a list of expenses into monthly spending totals by category.
 * All unknown categories are grouped under "Other".
 *
 * @param expenses - Array of ExpenseDisplay items with date, category, and totalPrice
 * @returns Array of CategoryShareData objects containing month (YYYY-MM) and totals for each category
 */
export function mapExpenseDisplayToCategoryShareData(
  expenses: ExpenseDisplay[],
): CategoryShareData[] {
  // Group expenses by month ("YYYY-MM")
  const grouped: Record<string, ExpenseDisplay[]> = Object.groupBy(expenses, (expense) => {
    const date = new Date(expense.date);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }) as Record<string, ExpenseDisplay[]>;

  // Sort months chronologically
  const sortedMonths = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  // Convert each month group into a CategoryShareData object
  return sortedMonths
    .map(([month, monthExpenses]) => {
      // Initialize totals for all categories from the constants
      const totals = EXPENSE_CATEGORIES_VALUES.reduce(
        (acc, category) => {
          acc[category] = 0;
          return acc;
        },
        {} as Record<string, number>,
      );

      // Sum expenses into the correct category
      for (const { category, totalPrice } of monthExpenses) {
        const key = EXPENSE_CATEGORIES_VALUES.find(
          c => c.toLowerCase() === category.toLowerCase(),
        ) || 'Other';

        totals[key] = (totals[key] ?? 0) + totalPrice;
      }

      // Return final object for this month
      return {
        date: month,
        ...totals,
      };
    });
}
