import * as Sentry from '@sentry/nextjs';
import ms from 'ms';
import { LogEvents } from '@/constants/log-events';
import User from '@/features/users/model';
import dbConnect from '@/lib/db/mongoose-client';
import { createLogger } from '@/lib/logger';
import { sendVerificationCodeEmail } from '@/lib/resend';
import { getUserById, updateUser } from '../users/data';
import { generateSixDigitCode, hashVerificationCode, timingSafeEqualHex } from './utils';

export async function issueVerificationCodeForUser(userId: string, ttlMs: number = ms('60m')) {
  const logger = createLogger('auth/verification');

  const user = await getUserById(userId);
  if (!user || !user.email)
    return false;

  const code = generateSixDigitCode();
  const expires = new Date(Date.now() + ttlMs);

  const codeHash = hashVerificationCode(code, userId);

  await updateUser({
    id: userId,
    data: {
      emailVerificationCode: codeHash,
      emailVerificationCodeExpires: expires,
    },
  });

  try {
    await sendVerificationCodeEmail(user.email, code);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_EMAIL_VERIFICATION, {
      userId,
      error: error instanceof Error ? error.message : 'unknown',
    });

    await updateUser({
      id: userId,
      data: {
        emailVerificationCode: undefined,
        emailVerificationCodeExpires: undefined,
      },
    });

    return false;
  }

  return true;
}

export async function confirmVerificationCodeForUser(userId: string, code: string) {
  await dbConnect();

  const user = await User.findById(userId);
  if (!user || !user.emailVerificationCode || !user.emailVerificationCodeExpires)
    return false;

  const inputHash = hashVerificationCode(code, userId);

  if (!timingSafeEqualHex(user.emailVerificationCode, inputHash))
    return false;

  if (user.emailVerificationCodeExpires.getTime() < Date.now())
    return false;

  user.emailVerified = new Date();
  user.emailVerificationCode = undefined;
  user.emailVerificationCodeExpires = undefined;
  await user.save();

  return true;
}
