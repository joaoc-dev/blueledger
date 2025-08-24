import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { confirmVerificationCodeForUser } from '@/features/auth/data';
import { validateConfirmVerificationCodeRateLimits } from '@/features/auth/rate-limit';
import { apiValidationCodeSchema } from '@/features/auth/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger, logRequest } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/auth/verification-code/confirm');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateSchema(apiValidationCodeSchema, body);

    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: validationResult.error.details,
        status: 400,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const code = validationResult.data.code;
    const userId = request.auth!.user!.id;

    const validateRateLimits = await validateConfirmVerificationCodeRateLimits(userId);
    if (!validateRateLimits.success) {
      logger.info(LogEvents.RATE_LIMIT_EXCEEDED, {
        requestId,
        userId,
        status: 429,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          error: 'Please wait before submitting another code.',
          retryAfter: validateRateLimits.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    const success = await confirmVerificationCodeForUser(userId, code);
    if (!success) {
      return NextResponse.json({ error: 'Failed to confirm verification code' }, { status: 400 });
    }

    logger.info(LogEvents.EMAIL_VERIFICATION_CONFIRMED, {
      requestId,
      userId,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_CONFIRMING_EMAIL_VERIFICATION, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
