import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import { env } from '@/env/server';

export function generateDigitsCode(length: number): string {
  const max = 10 ** length;
  return crypto.randomInt(0, max).toString().padStart(length, '0');
}

export function hashVerificationCode(code: string, userId?: string): string {
  const normalized = String(code).trim();
  const message = userId ? `${userId}:${normalized}` : normalized;
  return crypto.createHmac('sha256', env.AUTH_OTP_HASH_SECRET).update(message, 'utf8').digest('hex');
}

export function hashPasswordResetCode(code: string, email: string): string {
  const normalized = String(code).trim();
  const message = `${email.toLowerCase()}:${normalized}`;
  return crypto.createHmac('sha256', env.AUTH_OTP_HASH_SECRET).update(message, 'utf8').digest('hex');
}

export function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  const a = Buffer.from(aHex, 'hex');
  const b = Buffer.from(bHex, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
