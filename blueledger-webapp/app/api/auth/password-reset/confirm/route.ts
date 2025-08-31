import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { confirmPasswordResetForUser } from '@/features/auth/data';
import { validateConfirmPasswordResetRateLimits } from '@/features/auth/rate-limit';
import { passwordResetConfirmSchema } from '@/features/auth/schemas';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export async function POST(request: NextRequest) {
  const logger = createLogger('api/auth/password-reset/confirm:post', request);

  try {
    const body = await request.json();

    const validationResult = validateSchema(passwordResetConfirmSchema, body);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const email = validationResult.data.email.toLowerCase();

    const validateRateLimits = await validateConfirmPasswordResetRateLimits(email);
    if (!validateRateLimits.success) {
      logger.info(LogEvents.RATE_LIMIT_EXCEEDED, { email, status: 429 });

      await logger.flush();
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
      await logger.flush();
      return NextResponse.json({ error: 'Failed to confirm password reset' }, { status: 400 });
    }

    logger.info(LogEvents.EMAIL_PASSWORD_RESET_CONFIRMED, { email });

    await logger.flush();
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_CONFIRMING_EMAIL_PASSWORD_RESET, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
