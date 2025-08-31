import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { isGroupOwner } from '@/features/groups/data/group-memberships';
import { deleteGroup, getGroupById } from '@/features/groups/data/groups-data';
import { deleteGroupSchema } from '@/features/groups/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

/**
 * DELETE /api/groups/[id]
 *
 * Soft deletes a group by marking it as inactive. Only the group owner can delete their group.
 * Returns a success confirmation upon successful deletion.
 *
 * Return statuses:
 * - 200 OK : Group successfully soft deleted.
 * - 400 Bad Request : Invalid group ID format.
 * - 401 Unauthorized : User is not authenticated.
 * - 403 Forbidden : User is not the owner of the group.
 * - 404 Not Found : Group does not exist.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const DELETE = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const logger = createLogger('api/groups/[id]:delete', request);

  try {
    const { id } = await params;

    const validationResult = validateSchema(deleteGroupSchema, { id });
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });
      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const userId = request.auth!.user!.id;
    const group = await getGroupById(validationResult.data!.id);

    if (!group) {
      logger.warn(LogEvents.GROUP_NOT_FOUND, { id, status: 404 });

      await logger.flush();
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    const isOwner = await isGroupOwner(group.id!, userId);
    if (!isOwner) {
      logger.warn(LogEvents.GROUP_NOT_AUTHORIZED, { id, status: 403 });

      await logger.flush();
      return NextResponse.json(
        { error: 'Only owner can delete group' },
        { status: 403 },
      );
    }

    // Soft delete the group by marking it as inactive
    await deleteGroup({ id: group.id! });

    logger.info(LogEvents.GROUP_DELETED, { groupId: group.id, action: 'deleted', status: 200 });
    await logger.flush();
    return NextResponse.json({ success: true }, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_DELETING_GROUP, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
