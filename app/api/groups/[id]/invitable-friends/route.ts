import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { isGroupOwner } from '@/features/groups/data/group-memberships';
import { getInvitableFriends } from '@/features/groups/service';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * GET /api/groups/[id]/invitable-friends
 *
 * Retrieves a list of the authenticated user's friends who can be invited to join a group.
 * Only the group owner can view this list. Filters out friends who are already members
 * (with ACCEPTED or PENDING status) of the group.
 *
 * Returns an array of user objects representing friends who can be invited.
 * Each user object contains basic profile information (id, name, email, image).
 *
 * Return statuses:
 * - 200 OK : List of invitable friends retrieved successfully.
 * - 403 Forbidden : User is not the owner of the group.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const GET = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/groups/[id]/invitable-friends:get', request);

  try {
    const { id: groupId } = await params;
    const userId = request.auth!.user!.id;

    logger.info(LogEvents.GROUP_INVITABLE_FRIENDS_REQUESTED, {
      groupId,
      userId,
      status: 200,
    });

    const isOwner = await isGroupOwner(groupId, userId);
    if (!isOwner) {
      logger.warn(LogEvents.GROUP_NOT_AUTHORIZED, {
        groupId,
        userId,
        reason: 'User is not the owner of this group',
        status: 403,
      });

      return NextResponse.json(
        { error: 'Only the group owner can invite new members' },
        { status: 403 },
      );
    }

    const availableFriends = await getInvitableFriends(userId, groupId);

    logger.info(LogEvents.GROUP_INVITABLE_FRIENDS_FETCHED, {
      groupId,
      userId,
      availableFriendsCount: availableFriends.length,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(availableFriends);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_INVITABLE_FRIENDS, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
