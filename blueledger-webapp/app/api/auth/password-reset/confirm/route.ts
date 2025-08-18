import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { validateRequest } from '@/app/api/validateRequest';
import { LogEvents } from '@/constants/log-events';
import { confirmPasswordResetForUser } from '@/features/auth/data';
import { validateConfirmPasswordResetRateLimits } from '@/features/auth/rate-limit';
import { passwordResetConfirmSchema } from '@/features/auth/schemas';
import { createLogger, logRequest } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const logger = createLogger('api/auth/password-reset/confirm');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateRequest(passwordResetConfirmSchema, body);
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

    const validateRateLimits = await validateConfirmPasswordResetRateLimits(email);
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

    const code = validationResult.data.code;
    const newPassword = validationResult.data.newPassword;

    const success = await confirmPasswordResetForUser(email, code, newPassword);
    if (!success) {
      return NextResponse.json({ error: 'Failed to confirm password reset' }, { status: 400 });
    }

    logger.info(LogEvents.EMAIL_PASSWORD_RESET_CONFIRMED, {
      requestId,
      email,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_CONFIRMING_EMAIL_PASSWORD_RESET, {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
