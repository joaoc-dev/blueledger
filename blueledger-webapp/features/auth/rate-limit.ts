import type { RateLimitWindow } from '@/lib/rate-limit';
import { calculateRetryAfterMs, ratelimitTokenBucket } from '@/lib/rate-limit';
import {
  CONFIRM_ATTEMPTS_LIMIT_DAILY,
  CONFIRM_ATTEMPTS_LIMIT_SHORT,
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

async function validateRateLimit(
  keyPrefix: string,
  shortLimitConfig: { max: number; windowSec: number },
  dailyLimitConfig: { max: number; windowSec: number },
) {
  const shortKey = `${keyPrefix}:short`;
  const dailyKey = `${keyPrefix}:day`;

  const shortLimit = await ratelimitTokenBucket(
    shortLimitConfig.max,
    shortLimitConfig.windowSec,
    shortLimitConfig.max,
  ).limit(shortKey) as RateLimitWindow;

  const dailyLimit = await ratelimitTokenBucket(
    dailyLimitConfig.max,
    dailyLimitConfig.windowSec,
    dailyLimitConfig.max,
  ).limit(dailyKey) as RateLimitWindow;

  if (!shortLimit.success || !dailyLimit.success) {
    const retryAfterMs = calculateRetryAfterMs(shortLimit, dailyLimit);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    return { success: false as const, retryAfterSeconds };
  }

  return { success: true as const, retryAfterSeconds: 0 };
}
