import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { VERIFICATION_CODE_TTL_MS } from '@/features/auth/constants';
import { issueVerificationCodeForUser } from '@/features/auth/data';
import { validateSendVerificationCodeRateLimits } from '@/features/auth/rate-limit';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/auth/verification-code/send');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    ({ requestId } = logRequest(logger, request));

    const userId = request.auth!.user!.id;

    const validateRateLimits = await validateSendVerificationCodeRateLimits(userId);
    if (!validateRateLimits.success) {
      logger.info(LogEvents.RATE_LIMIT_EXCEEDED, {
        requestId,
        userId,
        status: 429,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          error: 'Please wait before requesting another code.',
          retryAfter: validateRateLimits.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    const success = await issueVerificationCodeForUser(userId, VERIFICATION_CODE_TTL_MS);
    if (!success)
      return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });

    logger.info(LogEvents.EMAIL_VERIFICATION_SENT, {
      requestId,
      userId,
      status: 200,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_EMAIL_VERIFICATION, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
