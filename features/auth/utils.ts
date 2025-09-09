import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
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

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compares two hex-encoded hashes in a timing-safe way.
 *
 * This prevents leaking information through timing attacks,
 * which could happen if a simple string comparison (===) was used.
 *
 * @param aHex - First hash (hex string)
 * @param bHex - Second hash (hex string)
 * @returns true if both hashes are equal, false otherwise
 */
export function timingSafeEqualHex(aHex: string, bHex: string): boolean {
  // Convert both hex strings into Buffers
  const a = Buffer.from(aHex, 'hex');
  const b = Buffer.from(bHex, 'hex');

  // Only compare if the Buffers are the same length
  // (different lengths → immediately false)
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
