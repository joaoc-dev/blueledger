import type {
  CreateUserData,
  CreateUserInput,
  UserApiResponse,
  UserAuthRecord,
} from '../schemas';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  createUserInputSchema,
  createUserSchema,
  patchUserSchema,
  userApiResponseSchema,
  userAuthRecordSchema,
  userProfileFormSchema,
} from '../schemas';

const validObjectId = '507f1f77bcf86cd799439011';

describe('users schemas', () => {
  let validData: any;

  beforeEach(() => {
    validData = {
      name: 'Alice',
      email: 'alice@example.com',
      password: '12345678',
      bio: 'Hello',
    };
  });

  describe('userProfileFormSchema', () => {
    it('should accept valid data', () => {
      expect(() => userProfileFormSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid name', () => {
      expect(() => userProfileFormSchema.parse({ ...validData, name: '' })).toThrow();
    });

    it('should reject invalid email', () => {
      expect(() => userProfileFormSchema.parse({ ...validData, email: 'bad' })).toThrow();
    });
  });

  describe('createUserInputSchema', () => {
    it('should require password between 8 and 72 characters', () => {
      const data: CreateUserInput = {
        name: 'Alice',
        email: 'alice@example.com',
        password: '12345678',
        bio: 'Hello',
      };
      expect(() => createUserInputSchema.parse(data)).not.toThrow();
      expect(() => createUserInputSchema.parse({ ...data, password: 'short' })).toThrow();
      expect(() => createUserInputSchema.parse({ ...data, password: 'a'.repeat(73) })).toThrow();
    });
  });

  describe('createUserSchema', () => {
    it('requires passwordHash in addition to input fields', () => {
      const data: CreateUserData = {
        name: 'Alice',
        email: 'alice@example.com',
        password: '12345678',
        passwordHash: 'hash',
        bio: 'Hello',
      };

      expect(() => createUserSchema.parse(data)).not.toThrow();
      expect(() => createUserSchema.parse({ ...data, passwordHash: undefined })).toThrow();
    });
  });

  describe('patchUserSchema', () => {
    it('requires valid id and at least one field', () => {
      expect(() => patchUserSchema.parse({ id: 'invalid', data: {} })).toThrow();
      expect(() => patchUserSchema.parse({ id: validObjectId, data: {} })).toThrow();
      expect(() => patchUserSchema.parse({ id: validObjectId, data: { name: 'x' } })).not.toThrow();
    });
  });

  describe('userApiResponseSchema and userDisplaySchema', () => {
    it('should validate shape with additional fields', () => {
      const data: UserApiResponse = {
        id: validObjectId,
        name: 'Alice',
        email: 'alice@example.com',
        bio: 'Hello',
        image: undefined,
        imagePublicId: undefined,
        emailVerified: new Date(),
      };
      expect(() => userApiResponseSchema.parse(data)).not.toThrow();
    });
  });

  describe('userAuthRecordSchema', () => {
    it('accepts minimal required and various optional fields', () => {
      const minimal: UserAuthRecord = {
        id: validObjectId,
        email: 'alice@example.com',
      };
      expect(() => userAuthRecordSchema.parse(minimal)).not.toThrow();

      const full: UserAuthRecord = {
        id: validObjectId,
        email: 'alice@example.com',
        name: 'Alice',
        image: 'https://example.com/a.png',
        bio: 'Hi',
        passwordHash: 'hash',
        emailVerified: null,
        emailVerificationCode: '123456',
        emailVerificationCodeExpires: new Date(),
        passwordResetCode: '654321',
        passwordResetCodeExpires: null,
        sessionInvalidAfter: new Date(),
      };
      expect(() => userAuthRecordSchema.parse(full)).not.toThrow();
    });

    it('should reject invalid id or email', () => {
      expect(() => userAuthRecordSchema.parse({ id: 'bad', email: 'ok@example.com' })).toThrow();
      expect(() => userAuthRecordSchema.parse({ id: validObjectId, email: 'bad' })).toThrow();
    });
  });
});
