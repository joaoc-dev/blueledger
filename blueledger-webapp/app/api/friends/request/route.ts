import type { NextAuthRequest } from 'next-auth';
import type { PusherEvent } from '@/constants/pusher-events';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { validateRequest } from '@/app/api/validateRequest';
import { LogEvents } from '@/constants/log-events';
import { PusherEvents } from '@/constants/pusher-events';
import { NOTIFICATION_TYPES } from '@/features/notifications/constants';
import { createNotification } from '@/features/notifications/data';
import { createNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';
import { sendToPusher } from '@/lib/pusher/pusher-server';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/friends/request');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));
    // const userId = request.auth!.user!.id;
    // fromUser = userId;

    const validationResult = validateRequest(createNotificationSchema, {
      user: body.targetUserId,
      fromUser: '6861b5b421c376f9e0ceaedb',
      type: NOTIFICATION_TYPES.FRIEND_REQUEST,
      isRead: false,
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

    await createNotification(validationResult.data!);

    const privateChannel = `private-user-${validationResult.data!.user}`;
    sendToPusher(privateChannel, PusherEvents.NOTIFICATION as PusherEvent, '');

    logger.info(LogEvents.FRIEND_REQUEST_SENT, {
      requestId,
      fromUser: validationResult.data!.fromUser,
      targetUserId: validationResult.data!.user,
      status: 201,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json(
      { message: 'Friend request sent' },
      { status: 201 },
    );
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_FRIEND_REQUEST, {
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
