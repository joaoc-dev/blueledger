import type { NextAuthRequest } from 'next-auth';
import type { PusherEvent } from '@/constants/pusher-events';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { PusherEvents } from '@/constants/pusher-events';
import { NOTIFICATION_TYPES } from '@/features/notifications/constants';
import { createNotification } from '@/features/notifications/data';
import { createNotificationSchema } from '@/features/notifications/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { sendToPusher } from '@/lib/pusher/pusher-server';
import { validateSchema } from '@/lib/validate-schema';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/groups/invite', request);

  try {
    const body = await request.json();
    // const userId = request.auth!.user!.id;
    // fromUser = userId;

    const validationResult = validateSchema(createNotificationSchema, {
      user: body.targetUserId,
      fromUser: '6861b5b421c376f9e0ceaedb',
      type: NOTIFICATION_TYPES.GROUP_INVITE,
      isRead: false,
    });

    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    await createNotification(validationResult.data!);

    const privateChannel = `private-user-${validationResult.data!.user}`;
    sendToPusher(privateChannel, PusherEvents.NOTIFICATION as PusherEvent, '');

    logger.info(LogEvents.GROUP_INVITE_SENT, {
      fromUser: validationResult.data!.fromUser,
      targetUserId: validationResult.data!.user,
      status: 201,
    });
    await logger.flush();
    return NextResponse.json({ message: 'Group invite sent' }, { status: 201 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_GROUP_INVITE, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
