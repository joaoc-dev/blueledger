import type { NextRequest } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { LogEvents } from '@/constants/log-events';
import { VERIFICATION_CODE_TTL_MS } from '@/features/auth/constants';
import { issueVerificationCodeForUser } from '@/features/auth/data';
import { createUser, getUserByEmail } from '@/features/users/data';
import { createUserSchema } from '@/features/users/schemas';
import { createLogger, logRequest } from '@/lib/logger';
import { validateRequest } from '../../validateRequest';

export async function POST(request: NextRequest) {
  const logger = createLogger('api/auth/signup');
  const startTime = Date.now();
  let requestId: string | undefined;

  try {
    const body = await request.json();
    ({ requestId } = logRequest(logger, request));

    const validationResult = validateRequest(createUserSchema, body);
    if (!validationResult.success) {
      logger.warn(LogEvents.VALIDATION_FAILED, {
        requestId,
        details: validationResult.error.details,
        status: 400,
        durationMs: Date.now() - startTime,
      });

      return NextResponse.json(validationResult.error, { status: 400 });
    }

    const name = validationResult.data.name;
    const email = validationResult.data.email.toLowerCase();
    const password = validationResult.data.password;

    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await createUser({
      name,
      email,
      password: passwordHash,
    });

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
