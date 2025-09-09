import { validateRateLimit } from '@/lib/rate-limit';
import {
  CONFIRM_ATTEMPTS_LIMIT_DAILY,
  CONFIRM_ATTEMPTS_LIMIT_SHORT,
  PASSWORD_RESET_CONFIRM_LIMIT_DAILY,
  PASSWORD_RESET_CONFIRM_LIMIT_SHORT,
  PASSWORD_RESET_REQUEST_LIMIT_DAILY,
  PASSWORD_RESET_REQUEST_LIMIT_SHORT,
  SEND_LIMIT_DAILY,
  SEND_LIMIT_SHORT,
} from './constants';

export async function validateSendVerificationCodeRateLimits(userId: string) {
  return validateRateLimit(
    `verify-send:${userId}`,
    SEND_LIMIT_SHORT,
    SEND_LIMIT_DAILY,
  );
}

export async function validateConfirmVerificationCodeRateLimits(userId: string) {
  return validateRateLimit(
    `verify-confirm:${userId}`,
    CONFIRM_ATTEMPTS_LIMIT_SHORT,
    CONFIRM_ATTEMPTS_LIMIT_DAILY,
  );
}

export async function validatePasswordResetRequestRateLimits(email: string) {
  return validateRateLimit(
    `pwd-reset-req:email:${email}`,
    PASSWORD_RESET_REQUEST_LIMIT_SHORT,
    PASSWORD_RESET_REQUEST_LIMIT_DAILY,
  );
}

export async function validateConfirmPasswordResetRateLimits(email: string) {
  return validateRateLimit(
    `pwd-reset-confirm:email:${email}`,
    PASSWORD_RESET_CONFIRM_LIMIT_SHORT,
    PASSWORD_RESET_CONFIRM_LIMIT_DAILY,
  );
}
