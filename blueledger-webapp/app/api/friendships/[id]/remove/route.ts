import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import { getFriendshipById, updateFriendshipStatus } from '@/features/friendship/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * PATCH /api/friendships/[id]/remove
 *
 * Removes an accepted friendship.
 * Either user in the friendship can remove it.
 * Returns the updated friendship.
 *
 * Return statuses:
 * - 200 OK : Friendship successfully removed.
 * - 409 Conflict : Friendship is not in an accepted state.
 * - 403 Forbidden : User is not authorized to remove this friendship.
 * - 404 Not Found : Friendship does not exist.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/friendships/[id]/remove:patch', request);

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

    // Check if user is either the requester or recipient
    if (!friendship.userIsRequester && !friendship.userIsRecipient) {
      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        userId,
        friendshipId: id,
        status: 403,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'You are not authorized to remove this friendship' },
        { status: 403 },
      );
    }

    // Check if friendship is in accepted state
    if (friendship.status !== FRIENDSHIP_STATUS.ACCEPTED) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        friendshipId: id,
        currentStatus: friendship.status,
        requiredStatus: FRIENDSHIP_STATUS.ACCEPTED,
        status: 409,
      });

      await logger.flush();
      return NextResponse.json(
        { error: `Cannot remove friendship with status '${friendship.status}'` },
        { status: 409 },
      );
    }

    // Update the friendship status to removed
    const updatedFriendship = await updateFriendshipStatus(id, FRIENDSHIP_STATUS.REMOVED);
    if (!updatedFriendship) {
      throw new Error('Failed to update friendship status');
    }

    logger.info(LogEvents.FRIENDSHIP_REMOVED, {
      friendshipId: id,
      removedBy: userId,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(
      {
        message: 'Friendship successfully removed',
        friendshipId: id,
      },
      { status: 200 },
    );
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_REMOVING_FRIENDSHIP, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
