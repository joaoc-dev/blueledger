import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { VERIFICATION_CODE_TTL_MS } from '@/features/auth/constants';
import { issueVerificationCodeForUser } from '@/features/auth/data';
import { hashPassword } from '@/features/auth/utils';
import { createUser, getUserByEmail } from '@/features/users/data';
import { createUserInputSchema, createUserSchema } from '@/features/users/schemas';
import { createLogger } from '@/lib/logger';
import { validateSchema } from '@/lib/validate-schema';

export async function POST(request: NextRequest) {
  const logger = createLogger('api/auth/signup', request);

  try {
    const body = await request.json();

    const inputValidationResult = validateSchema(createUserInputSchema, body);
    if (!inputValidationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: inputValidationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json(inputValidationResult.error, { status: 400 });
    }

    const userInput = inputValidationResult.data;
    const existingUser = await getUserByEmail(userInput.email);
    if (existingUser) {
      await logger.flush();
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await hashPassword(userInput.password);

    const newUserValidationResult = validateSchema(createUserSchema, {
      ...userInput,
      passwordHash,
    });

    if (!newUserValidationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        details: newUserValidationResult.error.details,
        status: 400,
      });

      await logger.flush();
      return NextResponse.json('New user validation failed', { status: 400 });
    }
    const user = await createUser(newUserValidationResult.data);

    // Issue email verification code
    await issueVerificationCodeForUser(user.id, VERIFICATION_CODE_TTL_MS);

    logger.info(
      LogEvents.AUTH_SIGN_UP,
      {
        provider: 'credentials_signup',
        userId: user.id,
        status: 201,
      },
    );
    await logger.flush();
    return NextResponse.json({ success: true });
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.AUTH_SIGN_UP_ERROR, {
      provider: 'credentials_signup',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500,
    });

    await logger.flush();
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
