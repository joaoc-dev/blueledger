import type { NextAuthRequest } from 'next-auth';
import type { PusherEvent } from '@/constants/pusher-events';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { PusherEvents } from '@/constants/pusher-events';
import { getFriendshipById, getFriendshipByUsers } from '@/features/friendship/data';
import { sendFriendRequestSchema } from '@/features/friendship/schemas';
import { sendFriendRequestWithNotification } from '@/features/friendship/service';
import { getUserByEmail } from '@/features/users/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { sendToPusher } from '@/lib/pusher/pusher-server';
import { validateSchema } from '@/lib/validate-schema';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/friendship/request:post', request);

  try {
    const body = await request.json();

    const validationResult = validateSchema(sendFriendRequestSchema, body);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const recipientEmail = validationResult.data!.email;
    const recipientUser = await getUserByEmail(recipientEmail);
    if (!recipientUser) {
      logger.warn(LogEvents.USER_NOT_FOUND, {
        email: recipientEmail,
        status: 404,
      });

      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (request.auth!.user!.id === recipientUser.id) {
      logger.warn(LogEvents.SELF_FRIEND_REQUEST, {
        userId: request.auth!.user!.id,
        status: 400,
      });

      return NextResponse.json(
        { error: 'Cannot send friend request to yourself' },
        { status: 400 },
      );
    }

    const existingFriendship = await getFriendshipByUsers(request.auth!.user!.id, recipientUser.id);
    if (existingFriendship) {
      logger.info(LogEvents.FRIENDSHIP_INVITE_ALREADY_EXISTS, {
        fromUser: request.auth!.user!.id,
        status: 200,
      });

      return NextResponse.json({ message: 'Already exists' }, { status: 200 });
    }

    const fromUser = request.auth!.user!.id;

    // Use the service that creates friendship and notification in a transaction
    const friendship = await sendFriendRequestWithNotification(fromUser, recipientUser.id);

    // Send pusher notification to recipient when created
    const privateChannel = `private-user-${recipientUser.id}`;
    sendToPusher(privateChannel, PusherEvents.NOTIFICATION as PusherEvent, '');

    logger.info(LogEvents.FRIENDSHIP_INVITE_SENT, {
      fromUser,
      targetUserId: recipientUser.id,
      status: 201,
    });

    // result of sending a friend request does not populate user fields
    const populatedFriendship = await getFriendshipById(friendship.id, fromUser);
    return NextResponse.json(populatedFriendship, { status: 201 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_FRIEND_REQUEST, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
