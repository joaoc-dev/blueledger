import { z } from 'zod';
import { EXPENSE_CATEGORIES_VALUES } from '../expenses/constants';

const dayOfWeekDataSchema = z.object({
  day: z.string(),
  averageSpent: z.number(),
});

export type DayOfWeekData = z.infer<typeof dayOfWeekDataSchema>;

const hourOfDayDataSchema = z.object({
  hour: z.string(),
  averageSpent: z.number(),
});

export type HourOfDayData = z.infer<typeof hourOfDayDataSchema>;

const categoryShareDataSchema = z.object({
  date: z.string(),
  ...EXPENSE_CATEGORIES_VALUES.reduce((acc, cat) => {
    acc[cat] = z.number();
    return acc;
  }, {} as Record<string, z.ZodNumber>),
});

export type CategoryShareData = z.infer<typeof categoryShareDataSchema>;

const cumulativeSpendDataSchema = z.object({
  month: z.string(),
  spent: z.number(),
  count: z.number(),
  avg: z.number(),
  cumulative: z.number(),
});

export type CumulativeSpendData = z.infer<typeof cumulativeSpendDataSchema>;

const seasonalDataSchema = z.object({
  season: z.string(),
  spent: z.number(),
  count: z.number(),
  percent: z.string(),
});

export type SeasonalData = z.infer<typeof seasonalDataSchema>;

const _dashboardDataSchema = z.object({
  categoryShare: z.array(categoryShareDataSchema),
  cumulativeSpend: z.array(cumulativeSpendDataSchema),
  dayOfWeek: z.array(dayOfWeekDataSchema),
  hourOfDay: z.array(hourOfDayDataSchema),
  seasonal: z.array(seasonalDataSchema),
});

export type DashboardData = z.infer<typeof _dashboardDataSchema>;
