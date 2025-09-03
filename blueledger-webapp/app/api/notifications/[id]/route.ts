import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import {
  getNotificationByIdAndUser,
  updateNotification,
} from '@/features/notifications/data';
import { patchNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

/**
 * PATCH /api/notifications/[id]
 *
 * Updates a specific notification for the authenticated user.
 * Users can only update their own notifications.
 * Returns the updated notification object.
 *
 * Return statuses:
 * - 200 OK : Notification successfully updated.
 * - 400 Bad Request : Invalid request data or validation failed.
 * - 401 Unauthorized : User is not authenticated.
 * - 403 Forbidden : User is not authorized to update this notification.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const PATCH = withAuth(
  async (
    request: NextAuthRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const logger = createLogger('api/notifications/[id]:patch', request);

    try {
      const { id } = await params;
      const body = await request.json();

      const validationResult = validateSchema(patchNotificationSchema, {
        id,
        data: body,
      });

      if (!validationResult.success) {
        logger.warn(LogEvents.VALIDATION_FAILED, {
          details: validationResult.error.details,
          status: 400,
        });
        await logger.flush();
        return NextResponse.json(validationResult.error, { status: 400 });
      }

      // Check if the authenticated user owns this notification
      const userId = request.auth!.user!.id!;
      const existingNotification = await getNotificationByIdAndUser(id, userId);

      if (!existingNotification) {
        logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
          notificationId: id,
          userId,
          reason: 'User attempted to update notification they do not own',
          status: 403,
        });
        await logger.flush();
        return NextResponse.json(
          { error: 'Forbidden: You can only update your own notifications' },
          { status: 403 },
        );
      }

      const notification = await updateNotification(validationResult.data!);
      logger.info(LogEvents.NOTIFICATION_UPDATED, {
        notificationId: id,
        status: 200,
      });
      await logger.flush();
      return NextResponse.json(notification, { status: 200 });
    }
    catch (error) {
      Sentry.captureException(error);

      logger.error(LogEvents.ERROR_PATCHING_NOTIFICATION, {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
    }
  },
);
