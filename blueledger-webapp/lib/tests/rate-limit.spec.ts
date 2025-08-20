import { describe, expect, it, vi } from 'vitest';
import { calculateRetryAfterMs } from '../rate-limit';

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
