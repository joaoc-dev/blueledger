import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { GROUP_MEMBERSHIP_STATUS } from '@/features/groups/constants';
import { getGroupMembershipByGroupIdAndUserId, getGroupMembershipWithDetails, isGroupOwner } from '@/features/groups/data/group-memberships';
import { getGroupById } from '@/features/groups/data/groups-data';
import { transferOwnershipSchema } from '@/features/groups/schemas';
import { transferOwnership } from '@/features/groups/service';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

/**
 * PATCH /api/groups/[id]/transfer
 *
 * Transfers ownership of a group to another member.
 * Only the current owner can transfer ownership.
 * The target user must be an accepted member of the group.
 *
 * Return statuses:
 * - 200 OK : Ownership successfully transferred.
 * - 400 Bad Request : Invalid request data or validation failed.
 * - 403 Forbidden : User is not authorized to transfer ownership.
 * - 404 Not Found : Group or target user membership not found.
 * - 409 Conflict : Cannot transfer ownership (target user not an accepted member, etc.).
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const PATCH = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/groups/[id]/transfer:patch', request);

  try {
    const { id: groupId } = await params;
    const userId = request.auth!.user!.id;
    const body = await request.json();

    const validation = validateSchema(transferOwnershipSchema, body);
    if (!validation.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validation.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validation.error, { status: 400 });
    }

    // Validate group exists
    const group = await getGroupById(groupId);
    if (!group) {
      logger.warn(LogEvents.GROUP_NOT_FOUND, { groupId, status: 404 });

      await logger.flush();
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    // Validate current user is owner
    const isOwner = await isGroupOwner(groupId, userId);
    if (!isOwner) {
      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        userId,
        groupId,
        status: 403,
      });

      await logger.flush();
      return NextResponse.json(
        { error: 'Only the current owner can transfer ownership' },
        { status: 403 },
      );
    }

    // Validate target membership exists and belongs to group
    const targetMembership = await getGroupMembershipWithDetails(validation.data!.toUserMembershipId);
    if (!targetMembership || targetMembership.group.id !== groupId) {
      logger.warn(LogEvents.GROUP_MEMBERSHIP_NOT_FOUND, {
        membershipId: validation.data!.toUserMembershipId,
        status: 404,
      });

      await logger.flush();
      return NextResponse.json({ error: 'Target membership not found' }, { status: 404 });
    }

    // Validate target user is an accepted member
    if (targetMembership.status !== GROUP_MEMBERSHIP_STATUS.ACCEPTED) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        membershipId: targetMembership.id!,
        currentStatus: targetMembership.status,
        requiredStatus: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
        status: 409,
      });

      await logger.flush();
      return NextResponse.json(
        { error: `Cannot transfer ownership to user with membership status '${targetMembership.status}'` },
        { status: 409 },
      );
    }

    // Get current user's membership
    const currentUserMembership = await getGroupMembershipByGroupIdAndUserId(groupId, userId);
    if (!currentUserMembership) {
      logger.warn(LogEvents.GROUP_MEMBERSHIP_NOT_FOUND, {
        groupId,
        userId,
        status: 404,
      });

      await logger.flush();
      return NextResponse.json({ error: 'Current user membership not found' }, { status: 404 });
    }

    // All validations passed, call the service
    await transferOwnership(
      currentUserMembership.id,
      validation.data!.toUserMembershipId,
    );

    await logger.flush();
    return NextResponse.json({ success: true }, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_TRANSFERRING_OWNERSHIP, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
