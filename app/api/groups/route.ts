import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { GROUP_MEMBERSHIP_STATUS, GROUP_ROLES, GROUP_STATUS } from '@/features/groups/constants';
import { getGroupMembershipWithDetails } from '@/features/groups/data/group-memberships';
import { createGroupWithMembershipSchema } from '@/features/groups/schemas';
import { createGroupAndMembership } from '@/features/groups/service';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

/**
 * POST /api/groups
 *
 * Creates a new group and automatically creates a group membership for the creator as the owner.
 * Returns the created group membership with all related details.
 *
 * Return statuses:
 * - 201 Created : Group and membership successfully created.
 * - 400 Bad Request : Invalid request data or validation failed.
 * - 401 Unauthorized : User is not authenticated.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/groups:post', request);

  try {
    const body = await request.json();
    const userId = request.auth!.user!.id;

    const groupData = {
      ...body,
      owner: userId,
      status: GROUP_STATUS.ACTIVE,
    };
    const groupMembershipData = {
      user: userId,
      invitedBy: userId,
      role: GROUP_ROLES.OWNER,
      status: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
    };

    const validation = validateSchema(createGroupWithMembershipSchema, {
      group: groupData,
      membership: groupMembershipData,
    });

    if (!validation.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validation.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validation.error, { status: 400 });
    }

    const { groupId, membershipId } = await createGroupAndMembership(validation.data!);
    logger.info(LogEvents.GROUP_CREATED, {
      groupId,
      membershipId,
      status: 201,
    });

    const membership = await getGroupMembershipWithDetails(membershipId);
    await logger.flush();
    return NextResponse.json(membership, { status: 201 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_CREATING_GROUP, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
