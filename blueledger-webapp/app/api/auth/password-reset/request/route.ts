import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { PASSWORD_RESET_CODE_TTL_MS } from '@/features/auth/constants';
import { issuePasswordResetCodeForUser } from '@/features/auth/data';
import { validatePasswordResetRequestRateLimits } from '@/features/auth/rate-limit';
import { emailPasswordResetSchema } from '@/features/auth/schemas';
import { createLogger, logRequest } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export async function POST(request: NextRequest) {
  const logger = createLogger('api/auth/password-reset/request');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateSchema(emailPasswordResetSchema, body);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: validationResult.error.details,
        status: 400,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(validationResult.error, { status: 400 });
    }
    const email = validationResult.data.email.toLowerCase();

    const validateRateLimits = await validatePasswordResetRequestRateLimits(email);
    if (!validateRateLimits.success) {
      logger.info(LogEvents.RATE_LIMIT_EXCEEDED, {
        requestId,
        email,
        status: 429,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(
        {
          error: 'Please wait before attempting to reset your password.',
          retryAfter: validateRateLimits.retryAfterSeconds,
        },
        { status: 429 },
      );
    }

    const success = await issuePasswordResetCodeForUser(email, PASSWORD_RESET_CODE_TTL_MS);
    if (!success)
      return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });

    logger.info(LogEvents.EMAIL_PASSWORD_RESET_SENT, {
      requestId,
      email,
      status: 200,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_EMAIL_PASSWORD_RESET, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
