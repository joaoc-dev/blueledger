import { describe, expect, it, vi } from 'vitest';
import { delay } from './delay';

vi.useFakeTimers();

describe('delay', () => {
  it('should resolve after the specified time', async () => {
    const promise = delay(10);
    vi.advanceTimersByTime(10);
    await expect(promise).resolves.toBeUndefined();
  });
});
