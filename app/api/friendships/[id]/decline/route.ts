import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import { getFriendshipById, updateFriendshipStatus } from '@/features/friendship/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * PATCH /api/friendships/[id]/decline
 *
 * Declines a pending friendship request.
 * Returns the updated friendship.
 *
 * Return statuses:
 * - 200 OK : Friendship successfully declined.
 * - 409 Conflict : Friendship is not in a pending state.
 * - 403 Forbidden : User is not authorized to decline this friendship request.
 * - 404 Not Found : Friendship does not exist.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/friendships/[id]/decline:patch', request);

  try {
    const { id } = await params;
    const userId = request.auth!.user!.id;

    // Find the friendship
    const friendship = await getFriendshipById(id, userId);
    if (!friendship) {
      logger.warn(LogEvents.FRIENDSHIP_NOT_FOUND, { id, status: 404 });

      await logger.flush();
      return NextResponse.json({ error: 'Friendship not found' }, { status: 404 });
    }

    if (!friendship.userIsRecipient) {
      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        userId,
        friendshipId: id,
        status: 403,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'You can only decline friend requests sent to you' },
        { status: 403 },
      );
    }

    if (friendship.status !== FRIENDSHIP_STATUS.PENDING) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        friendshipId: id,
        currentStatus: friendship.status,
        requiredStatus: FRIENDSHIP_STATUS.PENDING,
        status: 409,
      });

      await logger.flush();
      return NextResponse.json(
        { error: `Cannot decline friendship request with status '${friendship.status}'` },
        { status: 409 },
      );
    }

    const updatedFriendship = await updateFriendshipStatus(id, FRIENDSHIP_STATUS.DECLINED);
    if (!updatedFriendship) {
      throw new Error('Failed to update friendship status');
    }

    logger.info(LogEvents.FRIENDSHIP_INVITE_DECLINED, {
      friendshipId: updatedFriendship.id,
      status: 200,
    });

    // result of updating the status of a friend request does not populate user fields
    const populatedFriendship = await getFriendshipById(id, userId);
    await logger.flush();
    return NextResponse.json(populatedFriendship, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_DECLINING_FRIENDSHIP_INVITE, {
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
