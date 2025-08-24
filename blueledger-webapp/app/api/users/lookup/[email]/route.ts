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
import { createLogger, logRequest } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export const GET = withAuth(async (
  request: NextAuthRequest,
  { params }: { params: Promise<{ email: string }> },
) => {
  const logger = createLogger('api/users/lookup/[email]');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const { email } = await params;
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateSchema(emailSchema, email);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: { email: 'Invalid email' },
        status: 400,
        durationMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const userLookup = await getUserByEmail(validationResult.data);
    if (!userLookup) {
      logger.info(LogEvents.USER_NOT_FOUND, {
        requestId,
        status: 404,
        durationMs: Date.now() - startTime,
      });
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

    logger.info(LogEvents.USER_FETCHED, {
      requestId,
      status: 200,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json(user, { status: 200 });
  }
  catch (error) {
    Sentry.captureException(error);
    logger.error(LogEvents.ERROR_GETTING_USER, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
},
);
