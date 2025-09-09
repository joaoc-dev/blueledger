import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { PASSWORD_RESET_CODE_TTL_MS } from '@/features/auth/constants';
import { issuePasswordResetCodeForUser } from '@/features/auth/data';
import { validatePasswordResetRequestRateLimits } from '@/features/auth/rate-limit';
import { emailPasswordResetSchema } from '@/features/auth/schemas';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

/**
 * POST /api/auth/password-reset/request
 *
 * Initiates a password reset process by sending a reset code to the user's email.
 * Validates the email address and issues a password reset code with the configured TTL.
 * Rate limited to prevent abuse. Does not require authentication (public endpoint).
 *
 * Return statuses:
 * - 200 OK : Password reset code sent successfully.
 * - 400 Bad Request : Invalid email format or validation failed.
 * - 429 Too Many Requests : Rate limit exceeded, please wait before requesting another reset.
 * - 500 Internal Server Error : Unexpected error during password reset code generation or sending.
 */
export async function POST(request: NextRequest) {
  const logger = createLogger('api/auth/password-reset/request:post', request);

  try {
    const body = await request.json();

    const validationResult = validateSchema(emailPasswordResetSchema, body);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: validationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(validationResult.error, { status: 400 });
    }
    const email = validationResult.data.email.toLowerCase();

    const validateRateLimits
      = await validatePasswordResetRequestRateLimits(email);
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

    const success = await issuePasswordResetCodeForUser(
      email,
      PASSWORD_RESET_CODE_TTL_MS,
    );
    if (!success) {
      await logger.flush();
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 },
      );
    }

    logger.info(LogEvents.EMAIL_PASSWORD_RESET_SENT, { email, status: 200 });

    await logger.flush();
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_EMAIL_PASSWORD_RESET, {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
