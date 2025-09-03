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

/**
 * POST /api/groups/[id]/memberships
 *
 * Sends a group invitation to a user by email address.
 * Only the group owner can send invitations.
 * Creates or updates a membership to PENDING status and.
 * Creates a database notification and sends a real-time Pusher notification to the recipient.
 *
 * Request Body:
 * {
 *   "email": "user@example.com"
 * }
 *
 * Return statuses:
 * - 201 Created : Group invitation sent successfully.
 * - 400 Bad Request : Invalid email format or request data.
 * - 403 Forbidden : User is not the group owner.
 * - 404 Not Found : User with the specified email does not exist.
 * - 409 Conflict : Cannot invite yourself or user already invited/member.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const POST = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/groups/[id]/memberships:post', request);

  try {
    const { id: groupId } = await params;
    const inviterId = request.auth!.user!.id;

    const isOwner = await isGroupOwner(groupId, inviterId);
    if (!isOwner) {
      logger.warn(LogEvents.UNAUTHORIZED_REQUEST, {
        inviterId,
        groupId,
        status: 403,
      });

      await logger.flush();
      return NextResponse.json({ error: 'Only owner can invite' }, { status: 403 });
    }

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

    const recipientEmail = validation.data!.email;
    const recipientUser = await getUserByEmail(recipientEmail);
    if (!recipientUser) {
      logger.warn(LogEvents.USER_NOT_FOUND, {
        email: recipientEmail,
        status: 404,
      });

      await logger.flush();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recipientUserId = recipientUser.id!;

    // Prevent inviting owner or duplicate membership
    if (recipientUserId === inviterId) {
      logger.warn(LogEvents.VALIDATION_FAILED, { inviterId, status: 409 });

      await logger.flush();
      return NextResponse.json(
        { error: 'Cannot invite yourself' },
        { status: 409 },
      );
    }

    // Check if user is already a member or has a pending invite
    const existingMembership = await getGroupMembershipByGroupIdAndUserId(groupId, recipientUserId);

    const invalidMembershipStatus = existingMembership?.status === GROUP_MEMBERSHIP_STATUS.PENDING
      || existingMembership?.status === GROUP_MEMBERSHIP_STATUS.ACCEPTED;

    if (existingMembership && (invalidMembershipStatus)) {
      logger.warn(LogEvents.GROUP_MEMBERSHIP_INVITE, { groupId, recipientUserId, status: 409 });

      await logger.flush();
      return NextResponse.json(
        { error: 'Invite already exists or user already a member' },
        { status: 409 },
      );
    }

    // Create the membership
    const membershipId = await sendGroupInviteWithNotification(
      existingMembership,
      inviterId,
      recipientUserId,
      groupId,
    );

    // Send pusher notification to recipient when created
    const privateChannel = `private-user-${recipientUser.id}`;
    sendToPusher(privateChannel, PusherEvents.NOTIFICATION as PusherEvent, '');

    logger.info(LogEvents.GROUP_MEMBERSHIP_INVITE, {
      fromUser: inviterId,
      targetUserId: recipientUser.id,
      status: 201,
    });

    // result of sending a friend request does not populate user fields
    const populatedMembership = await getGroupMembershipWithDetails(membershipId);
    await logger.flush();
    return NextResponse.json(populatedMembership, { status: 201 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_INVITING_GROUP_MEMBERSHIP, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
