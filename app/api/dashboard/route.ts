import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import {
  mapExpenseDisplayToCategoryShareData,
  mapExpenseDisplayToCumulativeSpendYTDData,
  mapExpenseDisplayToDayOfWeekData,
  mapExpenseDisplayToHourOfDayData,
  mapExpenseDisplayToSeasonalData,
} from '@/features/dashboard/mapper-server';
import { getExpenses } from '@/features/expenses/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * GET /api/dashboard
 *
 * Retrieves dashboard data including expense analytics and charts.
 * Returns aggregated data for category shares, cumulative spend, day of week patterns, hour of day patterns, and seasonal trends.
 *
 * Return statuses:
 * - 200 OK : Dashboard data successfully retrieved.
 * - 401 Unauthorized : User is not authenticated.
 * - 500 Internal Server Error : Unexpected error during processing.
 */

export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/dashboard:get', request);

  try {
    const userId = request.auth!.user!.id;

    const expenses = await getExpenses(userId);

    const [categoryShare, cumulativeSpend, dayOfWeek, hourOfDay, seasonal]
      = await Promise.all([
        Promise.resolve(mapExpenseDisplayToCategoryShareData(expenses)),
        Promise.resolve(mapExpenseDisplayToCumulativeSpendYTDData(expenses)),
        Promise.resolve(mapExpenseDisplayToDayOfWeekData(expenses)),
        Promise.resolve(mapExpenseDisplayToHourOfDayData(expenses)),
        Promise.resolve(mapExpenseDisplayToSeasonalData(expenses)),
      ]);

    const dashboardData = {
      categoryShare,
      cumulativeSpend,
      dayOfWeek,
      hourOfDay,
      seasonal,
    };

    logger.info(LogEvents.DASHBOARD_DATA_FETCHED, { status: 200 });

    await logger.flush();
    return NextResponse.json(dashboardData);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_DASHBOARD_DATA, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
