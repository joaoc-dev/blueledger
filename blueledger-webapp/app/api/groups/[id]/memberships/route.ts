import type { NextAuthRequest } from 'next-auth';
import type { PusherEvent } from '@/constants/pusher-events';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { PusherEvents } from '@/constants/pusher-events';
import { GROUP_MEMBERSHIP_STATUS } from '@/features/groups/constants';
import {
  getAllGroupMembershipsWithDetails,
  getGroupMembershipByGroupIdAndUserId,
  getGroupMembershipWithDetails,
  isGroupMemberOrOwner,
  isGroupOwner,
} from '@/features/groups/data/group-memberships';
import { getGroupById } from '@/features/groups/data/groups-data';
import { inviteToGroupByEmailSchema } from '@/features/groups/schemas';
import { sendGroupInviteWithNotification } from '@/features/groups/service';
import { getUserByEmail } from '@/features/users/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { sendToPusher } from '@/lib/pusher/pusher-server';
import { validateSchema } from '@/lib/validate-schema';

/**
 * GET /api/groups/[id]/memberships
 *
 * Retrieves all memberships for a group with full user details.
 * Only group members or owners can view the membership list.
 * Returns an array of membership objects with user information.
 *
 * Return statuses:
 * - 200 OK : Memberships successfully retrieved.
 * - 401 Unauthorized : User is not authenticated.
 * - 403 Forbidden : User is not a member or owner of the group.
 * - 404 Not Found : Group does not exist.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const GET = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/groups/[id]/memberships:get', request);

  try {
    const { id: groupId } = await params;
    const userId = request.auth!.user!.id;

    // Verify group exists
    const group = await getGroupById(groupId);
    if (!group) {
      logger.warn(LogEvents.GROUP_NOT_FOUND, {
        groupId,
        status: 404,
      });

      await logger.flush();
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Authorization: Only group members/owners can view memberships
    // This is correct - maintains privacy while allowing members to see each other
    const isMemberOrOwner = await isGroupMemberOrOwner(groupId, userId);
    if (!isMemberOrOwner) {
      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        userId,
        groupId,
        status: 403,
      });

      await logger.flush();
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Fetch all memberships with detailed user information
    const allMemberships = await getAllGroupMembershipsWithDetails(groupId);
    logger.info(LogEvents.GROUP_MEMBERSHIPS_FETCHED, {
      groupId,
      returnedCount: allMemberships.length,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(allMemberships, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_GROUP_MEMBERSHIPS, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
