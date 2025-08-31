import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { VERIFICATION_CODE_TTL_MS } from '@/features/auth/constants';
import { issueVerificationCodeForUser } from '@/features/auth/data';
import { validateSendVerificationCodeRateLimits } from '@/features/auth/rate-limit';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/auth/verification-code/send:post', request);

  try {
    const userId = request.auth!.user!.id;

    const validateRateLimits = await validateSendVerificationCodeRateLimits(userId);
    if (!validateRateLimits.success) {
      logger.info(LogEvents.RATE_LIMIT_EXCEEDED, {
        userId,
        status: 429,
      });

      await logger.flush();
      return NextResponse.json(
        {
          error: 'Please wait before requesting another code.',
          retryAfter: validateRateLimits.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    const success = await issueVerificationCodeForUser(userId, VERIFICATION_CODE_TTL_MS);
    if (!success) {
      await logger.flush();
      return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
    }

    logger.info(LogEvents.EMAIL_VERIFICATION_SENT, {
      userId,
      status: 200,
    });

    await logger.flush();
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_EMAIL_VERIFICATION, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
