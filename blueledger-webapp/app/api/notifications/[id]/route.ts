import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { updateNotification } from '@/features/notifications/data';
import { patchNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/notifications/patch', request);

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
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const notification = await updateNotification(validationResult.data!);
    logger.info(LogEvents.NOTIFICATION_UPDATED, {
      notificationId: id,
      status: 200,
    });
    return NextResponse.json(notification, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_PATCHING_NOTIFICATION, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
