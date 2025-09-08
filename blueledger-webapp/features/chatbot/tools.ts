import { tool } from 'ai';
import { isValid as isValidDate, parseISO } from 'date-fns';
import { z } from 'zod';
import { EXPENSE_CATEGORIES_VALUES } from '@/features/expenses/constants';
import { getTotalsByCategoryForUser, getTotalSpentForUser } from '@/features/expenses/data';

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

  return {
    currentDate: tool({
      description: 'Get the current date.',
      inputSchema: z.object({}),
      execute: async () => {
        const date = new Date();
        console.warn('gettin current date', date);
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
  } as const;
}
