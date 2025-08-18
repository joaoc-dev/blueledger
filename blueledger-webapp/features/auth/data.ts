import * as Sentry from '@sentry/nextjs';
import ms from 'ms';
import { LogEvents } from '@/constants/log-events';
import User from '@/features/users/model';
import dbConnect from '@/lib/db/mongoose-client';
import { createLogger } from '@/lib/logger';
import { sendPasswordResetCodeEmail, sendVerificationCodeEmail } from '@/lib/resend';
import { getUserByEmail, getUserById, updateUser } from '../users/data';
import { PASSWORD_RESET_CODE_LENGTH, VERIFICATION_CODE_LENGTH } from './constants';
import { generateDigitsCode, hashPassword, hashPasswordResetCode, hashVerificationCode, timingSafeEqualHex } from './utils';

export async function issueVerificationCodeForUser(userId: string, ttlMs: number = ms('60m')) {
  const logger = createLogger('auth/issue-verification-code');

  const user = await getUserById(userId);
  if (!user || !user.email)
    return false;

  const code = generateDigitsCode(VERIFICATION_CODE_LENGTH);
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

export async function issuePasswordResetCodeForUser(email: string, ttlMs: number = ms('60m')) {
  const logger = createLogger('auth/issue-password-reset-code');

  const user = await getUserByEmail(email);
  if (!user || !user.email)
    return false;

  const code = generateDigitsCode(PASSWORD_RESET_CODE_LENGTH);
  const expires = new Date(Date.now() + ttlMs);
  const codeHash = hashPasswordResetCode(code, email);

  await updateUser({
    id: user.id,
    data: {
      passwordResetCode: codeHash,
      passwordResetCodeExpires: expires,
    },
  });

  try {
    await sendPasswordResetCodeEmail(user.email, code);
  }
  catch (error) {
    Sentry.captureException(error);

    logger.error(LogEvents.ERROR_SENDING_EMAIL_PASSWORD_RESET, {
      email,
      error: error instanceof Error ? error.message : 'unknown',
    });

    await updateUser({
      id: user.id,
      data: {
        passwordResetCode: undefined,
        passwordResetCodeExpires: undefined,
      },
    });

    return false;
  }

  return true;
}

export async function confirmPasswordResetForUser(email: string, code: string, newPassword: string) {
  await dbConnect();

  const user = await User.findOne({ email });
  if (!user || !user.passwordResetCode || !user.passwordResetCodeExpires)
    return false;

  const inputHash = hashPasswordResetCode(code, email);

  if (!timingSafeEqualHex(user.passwordResetCode, inputHash))
    return false;

  if (user.passwordResetCodeExpires.getTime() < Date.now())
    return false;

  const passwordHash = await hashPassword(newPassword);
  user.passwordHash = passwordHash;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  await user.save();

  return true;
}
