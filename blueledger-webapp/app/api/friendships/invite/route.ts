import type { NextAuthRequest } from 'next-auth';
import type { PusherEvent } from '@/constants/pusher-events';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { PusherEvents } from '@/constants/pusher-events';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import {
  getFriendshipById,
  getFriendshipByUsers,
} from '@/features/friendship/data';
import { sendFriendRequestSchema } from '@/features/friendship/schemas';
import { sendFriendRequestWithNotification } from '@/features/friendship/service';
import { getUserByEmail } from '@/features/users/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { sendToPusher } from '@/lib/pusher/pusher-server';
import { validateSchema } from '@/lib/validate-schema';

/**
 * POST /api/friendships/invite
 *
 * Sends a friend request to another user by email.
 * Creates a new friendship with pending status and sends a notification to the recipient.
 * Cannot send friend requests to yourself or to users with existing friendships.
 *
 * Return statuses:
 * - 201 Created : Friend request successfully sent.
 * - 400 Bad Request : Invalid request data, cannot send to yourself, or validation failed.
 * - 401 Unauthorized : User is not authenticated.
 * - 404 Not Found : Target user does not exist.
 * - 409 Conflict : Friend request already exists or users are already friends.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/friendships/invite:post', request);

  try {
    const body = await request.json();

    const validationResult = validateSchema(sendFriendRequestSchema, body);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const recipientEmail = validationResult.data!.email;
    const recipientUser = await getUserByEmail(recipientEmail);
    if (!recipientUser) {
      logger.warn(LogEvents.USER_NOT_FOUND, {
        email: recipientEmail,
        status: 404,
      });

      await logger.flush();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (request.auth!.user!.id === recipientUser.id) {
      logger.warn(LogEvents.SELF_FRIEND_REQUEST, {
        userId: request.auth!.user!.id,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'Cannot send friend request to yourself' },
        { status: 400 },
      );
    }

    const existingFriendship = await getFriendshipByUsers(
      request.auth!.user!.id,
      recipientUser.id,
    );
    if (existingFriendship) {
      if (existingFriendship.status === FRIENDSHIP_STATUS.PENDING) {
        logger.warn(LogEvents.FRIENDSHIP_INVITE_ALREADY_EXISTS, {
          fromUser: request.auth!.user!.id,
          toUser: recipientUser.id,
          status: 409,
        });

        await logger.flush();
        return NextResponse.json(
          { error: 'Friend request already exists and is pending' },
          { status: 409 },
        );
      }

      if (existingFriendship.status === FRIENDSHIP_STATUS.ACCEPTED) {
        logger.warn(LogEvents.FRIENDSHIP_INVITE_ALREADY_EXISTS, {
          fromUser: request.auth!.user!.id,
          toUser: recipientUser.id,
          existingStatus: FRIENDSHIP_STATUS.ACCEPTED,
          status: 409,
        });

        await logger.flush();
        return NextResponse.json(
          { error: 'You are already friends with this user' },
          { status: 409 },
        );
      }
    }

    const fromUser = request.auth!.user!.id;

    // Use the service that creates friendship and notification in a transaction
    const friendshipId = await sendFriendRequestWithNotification(
      existingFriendship,
      fromUser,
      recipientUser.id,
    );

    // Send pusher notification to recipient when created
    const privateChannel = `private-user-${recipientUser.id}`;
    sendToPusher(privateChannel, PusherEvents.NOTIFICATION as PusherEvent, '');

    logger.info(LogEvents.FRIENDSHIP_INVITE_SENT, {
      fromUser,
      targetUserId: recipientUser.id,
      status: 201,
    });

    // result of sending a friend request does not populate user fields
    const populatedFriendship = await getFriendshipById(friendshipId, fromUser);
    await logger.flush();
    return NextResponse.json(populatedFriendship, { status: 201 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_FRIEND_REQUEST, {
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
