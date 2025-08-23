import { describe, expect } from 'vitest';
import { test } from '@/tests/test-extend';
import { ApiError, apiGet } from '../api-client';

describe('api-client error mapping (msw)', () => {
  test('maps 429 to ApiError with retryAfter', async () => {
    let caught: ApiError | null = null;
    try {
      await apiGet('/_error/rate-limit');
    }
    catch (e) {
      caught = e as ApiError;
    }

    expect(caught).toBeInstanceOf(ApiError);
    expect(caught?.status).toBe(429);
    // rate limit response should include retryAfter
    expect(caught?.retryAfter).toBe(5);
    expect(caught?.message).toBeTruthy();
  });

  test('maps 500 server error to ApiError', async () => {
    let caught: ApiError | null = null;
    try {
      await apiGet('/_error/server-error');
    }
    catch (e) {
      caught = e as ApiError;
    }

    expect(caught).toBeInstanceOf(ApiError);
    expect(caught?.status).toBe(500);
    expect(caught?.retryAfter).toBeUndefined();
    expect(caught?.message).toBeTruthy();
  });

  test('maps 404 not found to ApiError', async () => {
    let caught: ApiError | null = null;
    try {
      await apiGet('/_error/not-found');
    }
    catch (e) {
      caught = e as ApiError;
    }

    expect(caught).toBeInstanceOf(ApiError);
    expect(caught?.status).toBe(404);
    expect(caught?.retryAfter).toBeUndefined();
    expect(caught?.message).toBeTruthy();
  });

  test('maps 400 validation error to ApiError', async () => {
    let caught: ApiError | null = null;
    try {
      await apiGet('/_error/validation');
    }
    catch (e) {
      caught = e as ApiError;
    }

    expect(caught).toBeInstanceOf(ApiError);
    expect(caught?.status).toBe(400);
    expect(caught?.retryAfter).toBeUndefined();
    expect(caught?.message).toBeTruthy();
  });
});
