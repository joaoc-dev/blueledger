import type { NextAuthRequest } from 'next-auth';
import type { FriendshipStatus } from '@/features/friendship/constants';
import type { UserDisplay } from '@/features/users/schemas';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import { getFriendshipStatus } from '@/features/friendship/data';
import { getUserByEmail } from '@/features/users/data';
import { emailSchema } from '@/features/users/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

/**
 * GET /api/users/lookup/[email]
 *
 * Looks up a user by email address and returns their profile information along with friendship status.
 * For the authenticated user themselves, returns isSelf: true and friendshipStatus: NONE.
 * For other users, includes the current friendship status between the authenticated user and the target user.
 *
 * Return statuses:
 * - 200 OK : User information successfully retrieved.
 * - 400 Bad Request : Invalid email format.
 * - 401 Unauthorized : User is not authenticated.
 * - 404 Not Found : User with the specified email does not exist.
 * - 500 Internal Server Error : Unexpected error during processing.
 */

export const GET = withAuth(
  async (
    request: NextAuthRequest,
    { params }: { params: Promise<{ email: string }> },
  ) => {
    const logger = createLogger('api/users/lookup/[email]:get', request);

    try {
      const { email } = await params;

      const validationResult = validateSchema(emailSchema, email);
      if (!validationResult.success) {
        logger.warn(LogEvents.VALIDATION_FAILED, {
          details: { email: 'Invalid email' },
          status: 400,
        });
        await logger.flush();
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
      }

      const userLookup = await getUserByEmail(validationResult.data);
      if (!userLookup) {
        logger.info(LogEvents.USER_NOT_FOUND, { status: 404 });

        await logger.flush();
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const userId = request.auth!.user!.id;
      const isSelf = userLookup.id === userId;

      let friendshipStatus: FriendshipStatus = FRIENDSHIP_STATUS.NONE;
      if (!isSelf)
        friendshipStatus = await getFriendshipStatus(userId, userLookup.id);

      const user: UserDisplay = {
        ...userLookup,
        isSelf,
        friendshipStatus,
      };

      logger.info(LogEvents.USER_FETCHED, { status: 200 });

      await logger.flush();
      return NextResponse.json(user, { status: 200 });
    }
    catch (error) {
      Sentry.captureException(error);

      logger.error(LogEvents.ERROR_GETTING_USER, {
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
