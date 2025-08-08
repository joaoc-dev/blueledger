import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { updateNotification } from '@/features/notifications/data';
import { patchNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';
import { validateRequest } from '../../validateRequest';

export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/notifications/patch');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const { id } = await params;
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateRequest(patchNotificationSchema, {
      id,
      data: body,
    });

    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: validationResult.error.details,
        status: 400,
        durationMs: Date.now() - startTime,
      });
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const notification = await updateNotification(validationResult.data!);
    logger.info(LogEvents.NOTIFICATION_UPDATED, {
      requestId,
      notificationId: id,
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json(notification, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_PATCHING_NOTIFICATION, {
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
