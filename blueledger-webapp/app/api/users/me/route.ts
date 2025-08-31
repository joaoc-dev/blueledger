import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { getUserById, updateUser } from '@/features/users/data';
import { patchUserSchema } from '@/features/users/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

// 🎯 OPTION 1: DIRECT USE - Even cleaner, no wrapper needed!
export const GET = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/users/me:get', request);

  try {
    const userId = request.auth?.user?.id;
    const user = await getUserById(userId!);

    if (!user) {
      logger.warn(LogEvents.USER_NOT_FOUND, { userId, status: 404 });
      await logger.flush();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logger.info(LogEvents.USER_FETCHED, { userId, status: 200 });
    await logger.flush();
    return NextResponse.json(user);
  }
  catch (error) {
    Sentry.captureException(error);
    logger.error(LogEvents.ERROR_GETTING_USER, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });
    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

export const PATCH = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/users/me:patch', request);

  try {
    const userId = request.auth?.user?.id;
    const body = await request.json();

    const validationResult = validateSchema(patchUserSchema, {
      id: userId,
      data: body,
    });

    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });
      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const user = await updateUser(validationResult.data!);

    if (!user) {
      logger.warn(LogEvents.USER_NOT_FOUND, { userId, status: 404 });
      await logger.flush();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logger.info(LogEvents.USER_UPDATED, { userId, status: 200 });
    await logger.flush();
    return NextResponse.json({ user, message: 'User updated successfully' });
  }
  catch (error) {
    Sentry.captureException(error);
    logger.error(LogEvents.ERROR_UPDATING_USER, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });
    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
