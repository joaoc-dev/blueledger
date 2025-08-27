import type { NextAuthRequest } from 'next-auth';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { confirmVerificationCodeForUser } from '@/features/auth/data';
import { validateConfirmVerificationCodeRateLimits } from '@/features/auth/rate-limit';
import { apiValidationCodeSchema } from '@/features/auth/schemas';
import { withAuth } from '@/lib/api/withAuth';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export const POST = withAuth(async (request: NextAuthRequest) => {
  const logger = createLogger('api/auth/verification-code/confirm', request);

  try {
    const body = await request.json();

    const validationResult = validateSchema(apiValidationCodeSchema, body);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const code = validationResult.data.code;
    const userId = request.auth!.user!.id;

    const validateRateLimits = await validateConfirmVerificationCodeRateLimits(userId);
    if (!validateRateLimits.success) {
      logger.info(LogEvents.RATE_LIMIT_EXCEEDED, { userId, status: 429 });

      await logger.flush();
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
      await logger.flush();
      return NextResponse.json({ error: 'Failed to confirm verification code' }, { status: 400 });
    }

    logger.info(LogEvents.EMAIL_VERIFICATION_CONFIRMED, { userId });

    await logger.flush();
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_CONFIRMING_EMAIL_VERIFICATION, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
