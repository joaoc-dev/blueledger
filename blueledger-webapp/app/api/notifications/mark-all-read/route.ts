import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { markAllNotificationsAsRead } from '@/features/notifications/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * PATCH /api/notifications/mark-all-read
 *
 * Marks all unread notifications as read for the authenticated user.
 * Returns a success confirmation upon completion.
 *
 * Return statuses:
 * - 200 OK : All notifications successfully marked as read.
 * - 401 Unauthorized : User is not authenticated.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const PATCH = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/notifications/mark-all-read:patch', request);

  try {
    const userId = request.auth!.user!.id!;

    await markAllNotificationsAsRead(userId);
    logger.info(LogEvents.NOTIFICATIONS_MARKED_ALL_READ, {
      userId,
      status: 200,
    });
    await logger.flush();
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_MARKING_ALL_NOTIFICATIONS_AS_READ, {
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
