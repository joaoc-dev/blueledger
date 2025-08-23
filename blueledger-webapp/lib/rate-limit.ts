import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Prefer explicit constructors when algorithm matters
export function ratelimitTokenBucket(requests: number, seconds: number, capacity: number = requests) {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.tokenBucket(requests, `${seconds} s`, capacity),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions.
     */
    prefix: 'blueledger/ratelimit',
  });
}

export interface RateLimitWindow {
  success: boolean;
  reset: number; // epoch ms when the window resets
  remaining: number;
}

export function calculateRetryAfterMs(...windows: RateLimitWindow[]): number {
  // This ensures the user waits until *all* limits have expired
  // (e.g., if they hit the daily cap, the short limit doesn't matter).

  // Subtract current time to get remaining wait in milliseconds.
  // Use Math.max(0, …) so if the limit already expired, we don't return negative time.
  const resetTimes = windows.filter(window => !window.success).map(window => window.reset);
  const reset = Math.max(...resetTimes) - Date.now();
  return Math.max(0, reset);
}

interface Limiter { limit: (key: string) => Promise<RateLimitWindow> }
interface CreateLimiter { (requests: number, seconds: number, capacity?: number): Limiter }

export async function validateRateLimit(
  keyPrefix: string,
  shortLimitConfig: { max: number; windowSec: number },
  dailyLimitConfig: { max: number; windowSec: number },
  createLimiter: CreateLimiter = ratelimitTokenBucket,
) {
  const shortKey = `${keyPrefix}:short`;
  const dailyKey = `${keyPrefix}:day`;

  const shortLimit = await createLimiter(
    shortLimitConfig.max,
    shortLimitConfig.windowSec,
    shortLimitConfig.max,
  ).limit(shortKey) as RateLimitWindow;

  const dailyLimit = await createLimiter(
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
