import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { getNotifications } from '@/features/notifications/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/notifications/get', request);

  try {
    const userId = request.auth!.user!.id!;

    const notifications = await getNotifications(userId);

    logger.info(LogEvents.NOTIFICATIONS_FETCHED, {
      returnedCount: notifications.length,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(notifications);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_NOTIFICATIONS, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
