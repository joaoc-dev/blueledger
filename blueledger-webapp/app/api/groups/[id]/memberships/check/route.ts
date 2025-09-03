import type { NextAuthRequest } from 'next-auth';
import type { MembershipCheckApiResponse } from '@/features/groups/schemas';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { GROUP_MEMBERSHIP_STATUS } from '@/features/groups/constants';
import {
  getGroupMembershipByGroupIdAndUserId,
  isGroupOwner,
} from '@/features/groups/data/group-memberships';
import { getGroupById } from '@/features/groups/data/groups-data';
import { inviteToGroupByEmailSchema } from '@/features/groups/schemas';
import { getUserByEmail } from '@/features/users/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

/**
 * POST /api/groups/[id]/memberships/check
 *
 * Checks if a user (by email) has any membership in the group and returns their membership status.
 * Only group owners can check membership status.
 * Returns an object containing the user, their membership status (or null if no membership), and whether they can be invited.
 *
 * Request Body:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Return statuses:
 * - 200 OK : Membership status retrieved successfully.
 * - 400 Bad Request : Invalid email format or missing request body.
 * - 401 Unauthorized : User is not authenticated.
 * - 403 Forbidden : User is not the group owner.
 * - 404 Not Found : Group does not exist or user with email does not exist.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const POST = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/groups/[id]/memberships/check:post', request);

  try {
    const { id: groupId } = await params;
    const userId = request.auth!.user!.id;

    // Parse request body with error handling
    const body = await request.json();

    const validation = validateSchema(inviteToGroupByEmailSchema, body);
    if (!validation.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validation.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validation.error, { status: 400 });
    }

    const group = await getGroupById(groupId);
    if (!group) {
      logger.warn(LogEvents.GROUP_NOT_FOUND, { groupId, status: 404 });

      await logger.flush();
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const isOwner = await isGroupOwner(groupId, userId);
    if (!isOwner) {
      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        userId,
        groupId,
        status: 403,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'Only group owners can check membership status' },
        { status: 403 },
      );
    }

    // Look up user by email
    const targetEmail = validation.data!.email;
    const targetUser = await getUserByEmail(targetEmail);
    if (!targetUser) {
      logger.warn(LogEvents.USER_NOT_FOUND, {
        email: targetEmail,
        status: 404,
      });

      await logger.flush();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has any membership in this group
    const membership = await getGroupMembershipByGroupIdAndUserId(groupId, targetUser.id!);

    const membershipCheckApiResponse: MembershipCheckApiResponse = {
      user: targetUser,
      membershipStatus: membership?.status,
      canInvite: !membership
        || membership.status === GROUP_MEMBERSHIP_STATUS.DECLINED
        || membership.status === GROUP_MEMBERSHIP_STATUS.CANCELED
        || membership.status === GROUP_MEMBERSHIP_STATUS.LEFT
        || membership.status === GROUP_MEMBERSHIP_STATUS.REMOVED,
    };

    await logger.flush();
    return NextResponse.json<MembershipCheckApiResponse>(membershipCheckApiResponse, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    console.warn(error);

    logger.error(LogEvents.ERROR_GETTING_GROUP_MEMBERSHIPS, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
