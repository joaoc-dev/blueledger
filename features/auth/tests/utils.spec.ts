import { describe, expect, it, vi } from 'vitest';
import * as utils from '../utils';

vi.mock('@/env/server', () => ({
  env: { AUTH_OTP_HASH_SECRET: 'secret' },
}));

describe('auth utils', () => {
  describe('generateDigitsCode', () => {
    it('produces fixed-length numeric strings', () => {
      for (const len of [4, 6, 8]) {
        const code = utils.generateDigitsCode(len);
        expect(code).toMatch(new RegExp(`^\\d{${len}}$`));
      }
    });
  });

  describe('hashVerificationCode', () => {
    it('produces the same hash for same input', () => {
      const a = utils.hashVerificationCode('123456');
      const b = utils.hashVerificationCode('123456');
      expect(a).toBe(b);
    });

    it('produces the same hash for same input and userId', () => {
      const a = utils.hashVerificationCode('123456', 'user1');
      const b = utils.hashVerificationCode('123456', 'user1');
      expect(a).toBe(b);
    });

    it('produces different hash if userId changes', () => {
      const a = utils.hashVerificationCode('123456', 'user1');
      const b = utils.hashVerificationCode('123456', 'user2');
      expect(a).not.toBe(b);
    });

    it('is stable and depends on userId when provided', () => {
      const a = utils.hashVerificationCode('123456');
      const b = utils.hashVerificationCode('123456');

      expect(a).toBe(b);
      const withUser = utils.hashVerificationCode('123456', 'user1');
      expect(withUser).not.toBe(a);
    });
  });

  describe('hashPasswordResetCode', () => {
    it('produces the same hash for same input and email', () => {
      const a = utils.hashPasswordResetCode('123456', 'user1@example.com');
      const b = utils.hashPasswordResetCode('123456', 'user1@example.com');
      expect(a).toBe(b);
    });

    it('produces different hash if email changes', () => {
      const a = utils.hashPasswordResetCode('123456', 'user1@example.com');
      const b = utils.hashPasswordResetCode('123456', 'user2@example.com');
      expect(a).not.toBe(b);
    });

    it('normalizes email to lowercase', () => {
      const x = utils.hashPasswordResetCode('123456', 'USER@EXAMPLE.COM');
      const y = utils.hashPasswordResetCode('123456', 'user@example.com');
      expect(x).toBe(y);
    });
  });

  describe('timingSafeEqualHex', () => {
    it('compares equal-length hashes correctly', () => {
      const h1 = utils.hashVerificationCode('111111');
      const h2 = utils.hashVerificationCode('111111');
      const h3 = utils.hashVerificationCode('222222');

      expect(utils.timingSafeEqualHex(h1, h2)).toBe(true);
      expect(utils.timingSafeEqualHex(h1, h3)).toBe(false);
    });
  });
});
