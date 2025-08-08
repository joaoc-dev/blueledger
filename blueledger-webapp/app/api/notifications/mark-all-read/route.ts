import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { markAllNotificationsAsRead } from '@/features/notifications/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';

export const PATCH = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/notifications/mark-all-read');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    ({ requestId } = logRequest(logger, request));
    const userId = request.auth!.user!.id!;

    await markAllNotificationsAsRead(userId);
    logger.info(LogEvents.NOTIFICATIONS_MARKED_ALL_READ, {
      requestId,
      userId,
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_MARKING_ALL_NOTIFICATIONS_AS_READ, {
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
