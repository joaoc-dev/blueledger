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

export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string; membershipId: string }> },
) => {
  const logger = createLogger('api/groups/[id]/memberships/[membershipId]/kick', request);

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
    if (!isOwner) {
      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        userId,
        groupId,
        status: 403,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'Users can only be kicked by the owner of the group' },
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
      return NextResponse.json({ error: 'Membership not found' }, { status: 404 });
    }

    const isMembershipRecipient = await isGroupMembershipRecipient(membershipId, userId);
    if (isMembershipRecipient) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        userId,
        membershipId,
        status: 409,
      });

      await logger.flush();
      return NextResponse.json({ error: 'You can only kick other members' }, { status: 409 });
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
        { error: `Cannot remove membership with status '${membership.status}'` },
        { status: 409 },
      );
    }

    await updateGroupMembershipStatus({
      membershipId,
      status: GROUP_MEMBERSHIP_STATUS.REMOVED,
    });

    logger.info(LogEvents.GROUP_MEMBERSHIP_REMOVED, {
      groupId,
      membershipId,
      status: 200,
    });

    const populatedMembership = await getGroupMembershipWithDetails(membershipId);
    await logger.flush();
    return NextResponse.json(populatedMembership, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_REMOVING_GROUP_MEMBERSHIP, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
