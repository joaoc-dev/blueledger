import type { RateLimitWindow } from '@/lib/rate-limit';
import { calculateRetryAfterMs, ratelimitTokenBucket } from '@/lib/rate-limit';
import { CONFIRM_ATTEMPTS_LIMIT_DAILY, CONFIRM_ATTEMPTS_LIMIT_SHORT, SEND_LIMIT_DAILY, SEND_LIMIT_SHORT } from './constants';

export async function validateSendVerificationCodeRateLimits(userId: string) {
  const shortKey = `verify-send:${userId}:short`;
  const dailyKey = `verify-send:${userId}:day`;

  const shortLimit = await ratelimitTokenBucket(
    SEND_LIMIT_SHORT.max,
    SEND_LIMIT_SHORT.windowSec,
    SEND_LIMIT_SHORT.max,
  ).limit(shortKey) as RateLimitWindow;

  const dailyLimit = await ratelimitTokenBucket(
    SEND_LIMIT_DAILY.max,
    SEND_LIMIT_DAILY.windowSec,
    SEND_LIMIT_DAILY.max,
  ).limit(dailyKey) as RateLimitWindow;

  if (!shortLimit.success || !dailyLimit.success) {
    const retryAfterMs = calculateRetryAfterMs(shortLimit, dailyLimit);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    return { success: false as const, retryAfterSeconds };
  }

  return { success: true as const, retryAfterSeconds: 0 };
}

export async function validateConfirmVerificationCodeRateLimits(userId: string) {
  const shortKey = `verify-confirm:${userId}:short`;
  const dailyKey = `verify-confirm:${userId}:day`;

  const shortLimit = await ratelimitTokenBucket(
    CONFIRM_ATTEMPTS_LIMIT_SHORT.max,
    CONFIRM_ATTEMPTS_LIMIT_SHORT.windowSec,
    CONFIRM_ATTEMPTS_LIMIT_SHORT.max,
  ).limit(shortKey) as RateLimitWindow;

  const dailyLimit = await ratelimitTokenBucket(
    CONFIRM_ATTEMPTS_LIMIT_DAILY.max,
    CONFIRM_ATTEMPTS_LIMIT_DAILY.windowSec,
    CONFIRM_ATTEMPTS_LIMIT_DAILY.max,
  ).limit(dailyKey) as RateLimitWindow;

  if (!shortLimit.success || !dailyLimit.success) {
    const retryAfterMs = calculateRetryAfterMs(shortLimit, dailyLimit);
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    return { success: false as const, retryAfterSeconds };
  }

  return { success: true as const, retryAfterSeconds: 0 };
}
