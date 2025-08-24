import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { VERIFICATION_CODE_TTL_MS } from '@/features/auth/constants';
import { issueVerificationCodeForUser } from '@/features/auth/data';
import { hashPassword } from '@/features/auth/utils';
import { createUser, getUserByEmail } from '@/features/users/data';
import { createUserInputSchema, createUserSchema } from '@/features/users/schemas';
import { createLogger, logRequest } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export async function POST(request: NextRequest) {
  const logger = createLogger('api/auth/signup');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const inputValidationResult = validateSchema(createUserInputSchema, body);
    if (!inputValidationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: inputValidationResult.error.details,
        status: 400,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(inputValidationResult.error, { status: 400 });
    }

    const userInput = inputValidationResult.data;
    const existingUser = await getUserByEmail(userInput.email);
    if (existingUser)
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const passwordHash = await hashPassword(userInput.password);

    const newUserValidationResult = validateSchema(createUserSchema, {
      ...userInput,
      passwordHash,
    });

    if (!newUserValidationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: newUserValidationResult.error.details,
        status: 400,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json('New user validation failed', { status: 400 });
    }
    const user = await createUser(newUserValidationResult.data);

    // Issue email verification code
    await issueVerificationCodeForUser(user.id, VERIFICATION_CODE_TTL_MS);

    logger.info(
      LogEvents.AUTH_SIGN_UP,
      {
        requestId,
        provider: 'credentials_signup',
        userId: user.id,
        status: 201,
        durationMs: Date.now() - startTime,
      },
    );
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.AUTH_SIGN_UP_ERROR, {
      requestId,
      provider: 'credentials_signup',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
      durationMs: Date.now() - startTime,
    });

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
