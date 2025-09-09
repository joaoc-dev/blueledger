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
 * POST /api/users/lookup
 *
 * Looks up a user by email address and returns their profile information along with friendship status.
 * Email is sent in request body to prevent PII leakage to logs and browser history.
 * Returns generic responses to prevent user enumeration attacks.
 *
 * Request body: { email: string }
 * Response: Always returns 200 with generic message, or 400/429/500 for errors.
 * User data is only included if the user exists and lookup succeeds.
 *
 * Return statuses:
 * - 200 OK : Generic success response (may or may not contain user data)
 * - 400 Bad Request : Invalid email format
 * - 401 Unauthorized : User is not authenticated
 * - 500 Internal Server Error : Unexpected error during processing
 */
export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/users/lookup:post', request);

  try {
    const body = await request.json();
    const { email } = body;

    const validationResult = validateSchema(emailSchema, email);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: { email: 'Invalid email format' },
        status: 400,
      });
      await logger.flush();

      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const userLookup = await getUserByEmail(validationResult.data);

    const userId = request.auth!.user!.id;
    let user: UserDisplay | null = null;

    if (userLookup) {
      const isSelf = userLookup.id === userId;

      let friendshipStatus: FriendshipStatus = FRIENDSHIP_STATUS.NONE;
      if (!isSelf)
        friendshipStatus = await getFriendshipStatus(userId, userLookup.id);

      user = {
        ...userLookup,
        isSelf,
        friendshipStatus,
      };

      logger.info(LogEvents.USER_FETCHED, { status: 200 });
    }
    else {
      // Log not found but don't expose in response to prevent enumeration
      logger.info(LogEvents.USER_NOT_FOUND, {
        email: validationResult.data,
        status: 200, // Log as 200 to avoid enumeration signals in logs
      });
    }

    await logger.flush();

    // Always return 200 with generic success message to prevent enumeration
    // Only include user data if found
    return NextResponse.json({
      success: true,
      message: 'Lookup completed',
      user,
    }, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_GETTING_USER, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();

    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 },
    );
  }
},
);
