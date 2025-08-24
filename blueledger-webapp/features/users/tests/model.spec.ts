import { describe, expect, it } from 'vitest';
import User from '../model';

describe('user model validation', () => {
  const validData = () => ({
    name: 'Alice',
    email: 'ALICE@EXAMPLE.COM ',
  });

  it('should validate a correct document (and normalize email)', async () => {
    const doc = new User(validData());
    await expect(doc.validate()).resolves.toBeUndefined();
    expect(doc.email).toBe('alice@example.com');
  });

  it('should require name', async () => {
    const doc = new User({ ...(validData() as any), name: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require email', async () => {
    const doc = new User({ ...(validData() as any), email: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should accept optional fields when valid', async () => {
    const doc = new User({
      ...validData(),
      image: 'https://example.com/a.png',
      imagePublicId: 'cloudinary-public-id',
      bio: 'Hello there',
      passwordHash: 'hash',
      emailVerified: new Date(),
      emailVerificationCode: '123456',
      emailVerificationCodeExpires: new Date(),
      passwordResetCode: '654321',
      passwordResetCodeExpires: new Date(),
      sessionInvalidAfter: new Date(),
    });
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it('should reject invalid date types for emailVerified', async () => {
    const doc = new User({ ...validData(), emailVerified: 'bad' as any });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should reject invalid date types for emailVerificationCodeExpires', async () => {
    const doc = new User({ ...validData(), emailVerificationCodeExpires: 'bad' as any });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should reject invalid date types for passwordResetCodeExpires', async () => {
    const doc = new User({ ...validData(), passwordResetCodeExpires: 'bad' as any });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should reject invalid date types for sessionInvalidAfter', async () => {
    const doc = new User({ ...validData(), sessionInvalidAfter: 'bad' as any });
    await expect(doc.validate()).rejects.toThrow();
  });
});
