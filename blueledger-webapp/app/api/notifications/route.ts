import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { getNotifications } from '@/features/notifications/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';

export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/notifications/get');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    ({ requestId } = logRequest(logger, request));

    const notifications = await getNotifications();

    logger.info(LogEvents.NOTIFICATIONS_FETCHED, {
      requestId,
      returnedCount: notifications.length,
      status: 200,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(notifications);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_NOTIFICATIONS, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
