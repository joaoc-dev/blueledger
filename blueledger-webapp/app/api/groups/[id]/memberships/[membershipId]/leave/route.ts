import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { GROUP_MEMBERSHIP_STATUS } from '@/features/groups/constants';
import {
  getGroupMembershipWithDetails,
  isGroupMembershipRecipient,
  isGroupOwner,
  updateGroupMembershipStatus,
} from '@/features/groups/data/group-memberships';
import { getGroupById } from '@/features/groups/data/groups-data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * PATCH /api/groups/[id]/memberships/[membershipId]/leave
 *
 * Allows a user to leave their accepted group membership.
 * Users can only leave their own membership and only if they are not the group owner.
 * Group owners must transfer ownership first or delete the group instead of leaving.
 * Changes the membership status from ACCEPTED to LEFT.
 * Returns the updated group membership with all related details.
 *
 * Return statuses:
 * - 200 OK : Membership successfully updated to LEFT status.
 * - 403 Forbidden : User is not authorized to leave this membership (not the membership recipient).
 * - 404 Not Found : Group or group membership does not exist.
 * - 409 Conflict : Cannot leave membership (owner trying to leave or membership not in accepted state).
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const PATCH = withAuth(
  async (
    request: NextAuthRequest,
    { params }: { params: Promise<{ id: string; membershipId: string }> },
  ) => {
    const logger = createLogger(
      'api/groups/[id]/memberships/[membershipId]/leave:patch',
      request,
    );

    try {
      const { id: groupId, membershipId } = await params;
      const userId = request.auth!.user!.id;

      const group = await getGroupById(groupId);
      if (!group) {
        logger.warn(LogEvents.GROUP_NOT_FOUND, { groupId, status: 404 });

        await logger.flush();
        return NextResponse.json({ error: 'Group not found' }, { status: 404 });
      }

      const isOwner = await isGroupOwner(groupId, userId);
      if (isOwner) {
        logger.warn(LogEvents.VALIDATION_FAILED, {
          userId,
          groupId,
          status: 409,
        });

        await logger.flush();
        return NextResponse.json(
          {
            error:
              'Owner cannot leave group. Transfer ownership first or delete the group.',
          },
          { status: 409 },
        );
      }

      const isMembershipRecipient = await isGroupMembershipRecipient(
        membershipId,
        userId,
      );
      if (!isMembershipRecipient) {
        logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
          userId,
          membershipId,
          status: 403,
        });

        await logger.flush();
        return NextResponse.json(
          { error: 'You can only leave your own membership' },
          { status: 403 },
        );
      }

      const membership = await getGroupMembershipWithDetails(membershipId);
      if (!membership || membership.group.id !== groupId) {
        logger.warn(LogEvents.GROUP_MEMBERSHIP_NOT_FOUND, {
          membershipId,
          status: 404,
        });

        await logger.flush();
        return NextResponse.json(
          { error: 'Membership not found' },
          { status: 404 },
        );
      }

      if (membership.status !== GROUP_MEMBERSHIP_STATUS.ACCEPTED) {
        logger.warn(LogEvents.VALIDATION_FAILED, {
          membershipId,
          currentStatus: membership.status,
          requiredStatus: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
          status: 409,
        });

        await logger.flush();
        return NextResponse.json(
          {
            error: `Cannot leave membership with status '${membership.status}'`,
          },
          { status: 409 },
        );
      }

      await updateGroupMembershipStatus({
        membershipId,
        status: GROUP_MEMBERSHIP_STATUS.LEFT,
      });

      logger.info(LogEvents.GROUP_MEMBERSHIP_LEFT, {
        groupId,
        membershipId,
        userId,
        status: 200,
      });

      const populatedMembership
        = await getGroupMembershipWithDetails(membershipId);
      await logger.flush();
      return NextResponse.json(populatedMembership, { status: 200 });
    }
    catch (error) {
      Sentry.captureException(error);

      logger.error(LogEvents.ERROR_LEAVING_GROUP_MEMBERSHIP, {
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 500,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 },
      );
    }
  },
);
