import { tool } from 'ai';
import { isValid as isValidDate, parseISO } from 'date-fns';
import { z } from 'zod';
import { EXPENSE_CATEGORIES_VALUES } from '@/features/expenses/constants';
import {
  getAverageDailySpendForUser,
  getExpensesCountForUser,
  getLargestExpensesForUser,
  getRecentExpensesForUser,
  getSpendingTimeSeriesForUser,
  getTotalsByCategoryForUser,
  getTotalSpentForUser,
  searchExpensesByDescriptionForUser,
} from '@/features/expenses/data';

function parseOptionalDate(value?: string): Date | undefined {
  if (!value)
    return undefined;
  const parsed = parseISO(value);
  return isValidDate(parsed) ? parsed : undefined;
}

export function getChatbotToolsForUser(userId: string) {
  // Accept either full ISO date-time or date-only (YYYY-MM-DD)
  const dateString = z.string().refine((value) => {
    try {
      const parsed = parseISO(value);
      return isValidDate(parsed);
    }
    catch {
      return false;
    }
  }, { message: 'Invalid ISO date or date-time string' });

  const totalSpentParams = z.object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    category: z.enum(EXPENSE_CATEGORIES_VALUES).optional(),
  });

  const topCategoriesParams = z.object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    limit: z.number().int().min(1).max(20).optional(),
  });

  const largestExpensesParams = z.object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    category: z.enum(EXPENSE_CATEGORIES_VALUES).optional(),
    limit: z.number().int().min(1).max(20).optional(),
  });

  const recentExpensesParams = z.object({
    limit: z.number().int().min(1).max(20).optional(),
  });

  const timeSeriesParams = z.object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    interval: z.enum(['day', 'week', 'month'] as const).optional(),
  });

  const countParams = z.object({
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    category: z.enum(EXPENSE_CATEGORIES_VALUES).optional(),
  });

  const searchParams = z.object({
    query: z.string().min(1),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    limit: z.number().int().min(1).max(50).optional(),
  });

  return {
    currentDate: tool({
      description: 'Get the current date.',
      inputSchema: z.object({}),
      execute: async () => {
        const date = new Date();
        return { date } as const;
      },
    }),
    totalSpent: tool({
      description: 'Get total amount spent by the user in an optional date range and/or category. Dates must be ISO strings (UTC).',
      inputSchema: totalSpentParams,
      execute: async ({ startDate, endDate, category }) => {
        const total = await getTotalSpentForUser({
          userId,
          startDate: parseOptionalDate(startDate),
          endDate: parseOptionalDate(endDate),
          category: category ?? undefined,
        });
        return { total } as const;
      },
    }),

    topCategories: tool({
      description: 'Get top spending categories for the user in an optional date range. Dates must be ISO strings (UTC).',
      inputSchema: topCategoriesParams,
      execute: async ({ startDate, endDate, limit }) => {
        const rows = await getTotalsByCategoryForUser({
          userId,
          startDate: parseOptionalDate(startDate),
          endDate: parseOptionalDate(endDate),
          limit: (limit ?? 5),
        });
        return { categories: rows } as const;
      },
    }),

    largestExpenses: tool({
      description: 'Get the largest individual expenses within an optional date range and/or category. Dates must be ISO strings (UTC).',
      inputSchema: largestExpensesParams,
      execute: async ({ startDate, endDate, category, limit }) => {
        const expenses = await getLargestExpensesForUser({
          userId,
          startDate: parseOptionalDate(startDate),
          endDate: parseOptionalDate(endDate),
          category: category ?? undefined,
          limit: limit ?? 5,
        });
        return { expenses } as const;
      },
    }),

    recentExpenses: tool({
      description: 'Get the most recent expenses for the user.',
      inputSchema: recentExpensesParams,
      execute: async ({ limit }) => {
        const expenses = await getRecentExpensesForUser({ userId, limit: limit ?? 10 });
        return { expenses } as const;
      },
    }),

    spendingTimeSeries: tool({
      description: 'Get spending totals bucketed by day, week, or month within an optional date range.',
      inputSchema: timeSeriesParams,
      execute: async ({ startDate, endDate, interval }) => {
        const points = await getSpendingTimeSeriesForUser({
          userId,
          startDate: parseOptionalDate(startDate),
          endDate: parseOptionalDate(endDate),
          interval: interval ?? 'day',
        });
        return { points } as const;
      },
    }),

    expensesCount: tool({
      description: 'Get count of expenses in an optional date range and/or category.',
      inputSchema: countParams,
      execute: async ({ startDate, endDate, category }) => {
        const count = await getExpensesCountForUser({
          userId,
          startDate: parseOptionalDate(startDate),
          endDate: parseOptionalDate(endDate),
          category: category ?? undefined,
        });
        return { count } as const;
      },
    }),

    averageDailySpend: tool({
      description: 'Get average daily spend over a date range (defaults to last 30 days).',
      inputSchema: z.object({ startDate: dateString.optional(), endDate: dateString.optional() }),
      execute: async ({ startDate, endDate }) => {
        const { average, days, total } = await getAverageDailySpendForUser({
          userId,
          startDate: parseOptionalDate(startDate),
          endDate: parseOptionalDate(endDate),
        });
        return { average, days, total } as const;
      },
    }),

    searchExpenses: tool({
      description: 'Search expenses by description text with optional date range. Useful for names or places (e.g., "Berlin", "mom").',
      inputSchema: searchParams,
      execute: async ({ query, startDate, endDate, limit }) => {
        const expenses = await searchExpensesByDescriptionForUser({
          userId,
          query,
          startDate: parseOptionalDate(startDate),
          endDate: parseOptionalDate(endDate),
          limit: limit ?? 10,
        });
        return { expenses } as const;
      },
    }),
  } as const;
}
