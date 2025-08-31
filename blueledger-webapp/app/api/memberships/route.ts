import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { getMembershipsForUser } from '@/features/groups/data/group-memberships';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * GET /api/memberships
 *
 * Retrieves all group memberships for the authenticated user.
 * Returns pending and accepted memberships for active groups only.
 *
 * Return statuses:
 * - 200 OK : Memberships successfully retrieved.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/memberships:get', request);

  try {
    const userId = request.auth!.user!.id;

    const memberships = await getMembershipsForUser(userId);

    logger.info(LogEvents.GROUP_MEMBERSHIPS_FETCHED, {
      returnedCount: memberships.length,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(memberships);
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
