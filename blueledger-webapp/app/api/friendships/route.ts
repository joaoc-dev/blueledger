import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { getFriendshipsForUser } from '@/features/friendship/data';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

/**
 * GET /api/friendships
 *
 * Retrieves all friendships for the authenticated user.
 * Returns an array of friendship objects with user details for both sides of each friendship.
 *
 * Return statuses:
 * - 200 OK : Friendships successfully retrieved.
 * - 401 Unauthorized : User is not authenticated.
 * - 500 Internal Server Error : Unexpected error during processing.
 */
export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/friendships:get', request);

  try {
    const userId = request.auth!.user!.id;
    const friendships = await getFriendshipsForUser(userId);

    logger.info(LogEvents.FRIENDSHIPS_FETCHED, {
      returnedCount: friendships.length,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json(friendships);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_FRIENDSHIPS, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
});
