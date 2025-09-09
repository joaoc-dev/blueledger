import { vi } from 'vitest';

vi.mock('@/env/server', () => ({
  env: {
    MONGODB_URI: 'mongodb://localhost:27017/test',
    SENTRY_AUTH_TOKEN: 'test-token',
    SENTRY_ORG: 'test-org',
    SENTRY_PROJECT: 'test-project',
    AUTH_EMAIL_VERIFICATION_FROM: 'test@example.com',
    AUTH_EMAIL_PASSWORD_RESET_FROM: 'test@example.com',
    AUTH_SECRET: 'test-secret',
    AUTH_OTP_HASH_SECRET: 'test-otp-secret',
    AUTH_GITHUB_ID: 'test-github-id',
    AUTH_GITHUB_SECRET: 'test-github-secret',
    CLOUDINARY_CLOUD_NAME: 'test-cloud',
    CLOUDINARY_API_KEY: 'test-api-key',
    CLOUDINARY_UPLOAD_PRESET: 'test-preset',
    CLOUDINARY_API_SECRET: 'test-api-secret',
    PUSHER_APP_ID: 'test-pusher-id',
    PUSHER_SECRET: 'test-pusher-secret',
    RESEND_API_KEY: 'test-resend-key',
    UPSTASH_REDIS_REST_URL: 'test-redis-url',
    UPSTASH_REDIS_REST_TOKEN: 'test-redis-token',
  },
}));

vi.mock('@/lib/logger', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  withScope: vi.fn(),
}));

vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(() => ({
      capture: vi.fn(),
      identify: vi.fn(),
      reset: vi.fn(),
    })),
  },
}));

vi.mock('@/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ id: 'test-email-id' }),
    },
  },
}));

vi.mock('@/lib/cloudinary', () => ({
  uploadImage: vi.fn().mockResolvedValue({
    public_id: 'test-image-id',
    secure_url: 'https://test.cloudinary.com/test-image.jpg',
  }),
  deleteImage: vi.fn().mockResolvedValue({ result: 'ok' }),
}));
