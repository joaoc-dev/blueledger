import { beforeEach, describe, expect, it, vi } from 'vitest';
import { calculateRetryAfterMs, validateRateLimit } from '../rate-limit';

function createMockFactory(results: Array<{ success: boolean; resetMs: number; remaining: number }>) {
  const limit = vi.fn();
  results.forEach(r => limit.mockResolvedValueOnce({ success: r.success, reset: r.resetMs, remaining: r.remaining }));
  return () => ({ limit });
}

describe('rate-limit', () => {
  describe('calculateRetryAfterMs', () => {
    it('should return 0 when all windows succeeded', () => {
      const ms = calculateRetryAfterMs(
        { success: true, reset: Date.now() + 10000, remaining: 1 },
        { success: true, reset: Date.now() + 20000, remaining: 1 },
      );
      expect(ms).toBe(0);
    });

    it('should use the longest reset among failed windows', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));

      const ms = calculateRetryAfterMs(
        { success: false, reset: Date.now() + 3000, remaining: 0 },
        { success: false, reset: Date.now() + 5000, remaining: 0 },
        { success: true, reset: Date.now() + 1000, remaining: 1 },
      );

      expect(ms).toBe(5000);
      vi.useRealTimers();
    });

    it('should return 0 when the limit has already expired', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-01T00:00:10.000Z'));

      const ms = calculateRetryAfterMs(
        { success: false, reset: Date.now() - 1000, remaining: 0 },
      );

      expect(ms).toBe(0);
      vi.useRealTimers();
    });
  });

  describe('rate-limit validators', () => {
    const shortLimitConfig = { max: 10, windowSec: 10 };
    const dailyLimitConfig = { max: 100, windowSec: 86400 };
    const now = Date.now();

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('should return success when both windows succeed', async () => {
      const factory = createMockFactory([
        { success: true, resetMs: now + 1000, remaining: 1 },
        { success: true, resetMs: now + 3600000, remaining: 19 },
      ]);

      const result = await validateRateLimit('u1', shortLimitConfig, dailyLimitConfig, factory as any);

      expect(result).toEqual({ success: true, retryAfterSeconds: 0 });
    });

    it('should return failure with the longest window retryAfterSeconds', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(now);

      const factory = createMockFactory([
        { success: false, resetMs: now + 4000, remaining: 0 },
        { success: false, resetMs: now + 9000, remaining: 0 },
      ]);
      const result = await validateRateLimit('u1', shortLimitConfig, dailyLimitConfig, factory as any);
      expect(result.success).toBe(false);
      expect(result.retryAfterSeconds).toBe(9);

      vi.useRealTimers();
    });

    it('should return failure with the longest window retryAfterSeconds even if the first window is successful', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(now);

      const factory = createMockFactory([
        { success: true, resetMs: now + 2000, remaining: 1 },
        { success: false, resetMs: now + 9000, remaining: 0 },
      ]);
      const result = await validateRateLimit('u1', shortLimitConfig, dailyLimitConfig, factory as any);
      expect(result.success).toBe(false);
      expect(result.retryAfterSeconds).toBe(9);

      vi.useRealTimers();
    });
  });
});
