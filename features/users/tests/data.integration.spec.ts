import type { PatchUserData } from '../schemas';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { fullIntegrationTestHooks } from '@/tests/integration-setup/full-integration-setup';
import {
  createUser,
  getUserAuthRecordByEmail,
  getUserAuthRecordById,
  getUserByEmail,
  getUserById,
  markEmailVerified,
  removeEmailVerificationCode,
  removeImageFromUser,
  removePasswordResetCode,
  setEmailVerificationCode,
  setPasswordResetCode,
  updatePasswordAndClearReset,
  updateUser,
} from '../data';

beforeAll(fullIntegrationTestHooks.beforeAll);
beforeEach(fullIntegrationTestHooks.beforeEach);
afterEach(fullIntegrationTestHooks.afterEach);
afterAll(fullIntegrationTestHooks.afterAll);

describe('users data - integration tests', () => {
  describe('getUserById', () => {
    it('should get user by id', async () => {
      const userData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
      };

      const created = await createUser(userData as any);
      const found = await getUserById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('Jane Smith');
      expect(found?.email).toBe('jane@example.com');
    });

    it('should return null for non-existent user by id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const found = await getUserById(fakeId);
      expect(found).toBeNull();
    });

    it('should return null for invalid user id', async () => {
      const found = await getUserById('invalid-id');
      expect(found).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should get user by email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const created = await createUser(userData as any);
      const found = await getUserByEmail(created.email);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe('John Doe');
      expect(found?.email).toBe('john@example.com');
    });

    it('should return null for non-existent user by email', async () => {
      const found = await getUserByEmail('nonexistent@example.com');
      expect(found).toBeNull();
    });

    it('should return null for invalid email', async () => {
      const found = await getUserByEmail('invalid-email');
      expect(found).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const user = await createUser(userData as any);
      expect(user).toBeDefined();
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.id).toBeDefined();
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userData = {
        name: 'Original Name',
        email: 'original@example.com',
      };

      const created = await createUser(userData as any);

      const updated = await updateUser({
        id: created.id,
        data: {
          name: 'Updated Name',
          email: 'updated@example.com',
        },
      } as PatchUserData);

      expect(updated).not.toBeNull();
      expect(updated?.id).toBe(created.id);
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.email).toBe('updated@example.com');
    });

    it('should return null when updating non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const updated = await updateUser({
        id: fakeId,
        data: { name: 'New Name' },
      } as PatchUserData);
      expect(updated).toBeNull();
    });
  });

  describe('removeImageFromUser', () => {
    it('should remove image from user', async () => {
      const userData = {
        name: 'User With Image',
        email: 'image@example.com',
      };

      const created = await createUser(userData as any);

      // First update user to have an image
      const updated = await updateUser({
        id: created.id,
        data: { image: 'test-image.jpg' },
      } as PatchUserData);

      expect(updated).not.toBeNull();
      expect(updated?.id).toBe(created.id);
      expect(updated?.image).toBe('test-image.jpg');

      // Then remove the image
      const userWithoutImage = await removeImageFromUser(created.id);

      expect(userWithoutImage).not.toBeNull();
      expect(userWithoutImage?.id).toBe(created.id);
      expect(userWithoutImage?.image).toBe('');
      expect(userWithoutImage?.imagePublicId).toBe('');
    });

    it('should return null when removing image from non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const result = await removeImageFromUser(fakeId);
      expect(result).toBeNull();
    });
  });

  describe('getUserAuthRecordById', () => {
    it('should get user auth record by id', async () => {
      const userData = {
        name: 'Auth User',
        email: 'auth-email@example.com',
        passwordHash: 'hashedpassword123',
        bio: 'Email test bio',
      };

      const created = await createUser(userData as any);
      const authRecord = await getUserAuthRecordById(created.id);

      expect(authRecord).not.toBeNull();
      expect(authRecord?.id).toBe(created.id);
      expect(authRecord?.name).toBe('Auth User');
      expect(authRecord?.email).toBe('auth-email@example.com');
      expect(authRecord?.bio).toBe('Email test bio');
      expect(authRecord?.passwordHash).toBe('hashedpassword123');
    });

    it('should return null for non-existent user by id', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const authRecord = await getUserAuthRecordById(fakeId);
      expect(authRecord).toBeNull();
    });

    it('should return null for invalid user id', async () => {
      const authRecord = await getUserAuthRecordById('invalid-id');
      expect(authRecord).toBeNull();
    });
  });

  describe('getUserAuthRecordByEmail', () => {
    it('should get user auth record by email', async () => {
      const userData = {
        name: 'Auth User Email',
        email: 'auth-email@example.com',
        passwordHash: 'hashedpassword123',
        bio: 'Email test bio',
      };

      const created = await createUser(userData as any);
      const authRecord = await getUserAuthRecordByEmail(created.email);

      expect(authRecord).not.toBeNull();
      expect(authRecord?.id).toBe(created.id);
      expect(authRecord?.name).toBe('Auth User Email');
      expect(authRecord?.email).toBe('auth-email@example.com');
      expect(authRecord?.passwordHash).toBe('hashedpassword123');
      expect(authRecord?.bio).toBe('Email test bio');
    });

    it('should return null for non-existent user by email', async () => {
      const authRecord = await getUserAuthRecordByEmail('nonexistent@example.com');
      expect(authRecord).toBeNull();
    });

    it('should return null for invalid email', async () => {
      const authRecord = await getUserAuthRecordByEmail('invalid-email');
      expect(authRecord).toBeNull();
    });
  });

  describe('setEmailVerificationCode', () => {
    it('should set email verification code', async () => {
      const userData = {
        name: 'Verification User',
        email: 'verify@example.com',
      };

      const created = await createUser(userData as any);
      const codeHash = 'verification-hash-123';
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await setEmailVerificationCode(created.id, {
        codeHash,
        expires,
      });

      // Verify the code was set by getting the auth record
      const authRecord = await getUserAuthRecordById(created.id);
      expect(authRecord?.emailVerificationCode).toBe(codeHash);
      expect(authRecord?.emailVerificationCodeExpires).toEqual(expires);
    });

    it('should not set code for invalid user id', async () => {
      const codeHash = 'verification-hash-456';
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Should not throw error, just do nothing
      await expect(setEmailVerificationCode('invalid-id', {
        codeHash,
        expires,
      })).resolves.toBeUndefined();
    });
  });

  describe('removeEmailVerificationCode', () => {
    it('should remove email verification code', async () => {
      const userData = {
        name: 'Remove Code User',
        email: 'removecode@example.com',
      };

      const created = await createUser(userData as any);

      // First set a verification code
      await setEmailVerificationCode(created.id, {
        codeHash: 'code-to-remove',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      // Verify it was set
      let authRecord = await getUserAuthRecordById(created.id);
      expect(authRecord?.emailVerificationCode).toBe('code-to-remove');

      // Now remove it
      await removeEmailVerificationCode(created.id);

      // Verify it was removed
      authRecord = await getUserAuthRecordById(created.id);
      expect(authRecord?.emailVerificationCode).toBeUndefined();
      expect(authRecord?.emailVerificationCodeExpires).toBeNull();
    });

    it('should not remove code for invalid user id', async () => {
      // Should not throw error, just do nothing
      await expect(removeEmailVerificationCode('invalid-id')).resolves.toBeUndefined();
    });
  });

  describe('markEmailVerified', () => {
    it('should mark email as verified', async () => {
      const userData = {
        name: 'Verified User',
        email: 'verified@example.com',
      };

      const created = await createUser(userData as any);

      // First set a verification code
      await setEmailVerificationCode(created.id, {
        codeHash: 'code-to-verify',
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      // Mark as verified
      await markEmailVerified(created.id);

      // Verify email is marked as verified and codes are removed
      const authRecord = await getUserAuthRecordById(created.id);
      expect(authRecord?.emailVerified).toBeInstanceOf(Date);
      expect(authRecord?.emailVerificationCode).toBeUndefined();
      expect(authRecord?.emailVerificationCodeExpires).toBeNull();
    });

    it('should not mark email verified for invalid user id', async () => {
      // Should not throw error, just do nothing
      await expect(markEmailVerified('invalid-id')).resolves.toBeUndefined();
    });
  });

  describe('setPasswordResetCode', () => {
    it('should set password reset code', async () => {
      const userData = {
        name: 'Reset Code User',
        email: 'resetcode@example.com',
      };

      const created = await createUser(userData as any);
      const codeHash = 'reset-hash-123';
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      await setPasswordResetCode(created.email, {
        codeHash,
        expires,
      });

      // Verify the code was set
      const authRecord = await getUserAuthRecordByEmail(created.email);
      expect(authRecord?.passwordResetCode).toBe(codeHash);
      expect(authRecord?.passwordResetCodeExpires).toEqual(expires);
    });

    it('should not set code for non-existent email', async () => {
      const codeHash = 'reset-hash-456';
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      // Should not throw error, just do nothing
      await expect(setPasswordResetCode('nonexistent@example.com', {
        codeHash,
        expires,
      })).resolves.toBeUndefined();
    });
  });

  describe('removePasswordResetCode', () => {
    it('should remove password reset code', async () => {
      const userData = {
        name: 'Remove Reset Code User',
        email: 'removeresetcode@example.com',
      };

      const created = await createUser(userData as any);

      // First set a reset code
      await setPasswordResetCode(created.email, {
        codeHash: 'reset-code-to-remove',
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      // Verify it was set
      let authRecord = await getUserAuthRecordByEmail(created.email);
      expect(authRecord?.passwordResetCode).toBe('reset-code-to-remove');

      // Now remove it
      await removePasswordResetCode(created.email);

      // Verify it was removed
      authRecord = await getUserAuthRecordByEmail(created.email);
      expect(authRecord?.passwordResetCode).toBeUndefined();
      expect(authRecord?.passwordResetCodeExpires).toBeNull();
    });

    it('should not remove code for non-existent email', async () => {
      // Should not throw error, just do nothing
      await expect(removePasswordResetCode('nonexistent@example.com')).resolves.toBeUndefined();
    });
  });

  describe('updatePasswordAndClearReset', () => {
    it('should update password and clear reset code', async () => {
      const userData = {
        name: 'Password Update User',
        email: 'passwordupdate@example.com',
        passwordHash: 'old-password-hash',
      };

      const created = await createUser(userData as any);

      // First set a reset code
      await setPasswordResetCode(created.email, {
        codeHash: 'reset-code-for-password-update',
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });

      // Update password and clear reset code
      const newPasswordHash = 'new-password-hash-123';
      await updatePasswordAndClearReset(created.email, {
        passwordHash: newPasswordHash,
      });

      // Verify password was updated and reset code was cleared
      const authRecord = await getUserAuthRecordByEmail(created.email);
      expect(authRecord?.passwordHash).toBe(newPasswordHash);
      expect(authRecord?.passwordResetCode).toBeUndefined();
      expect(authRecord?.passwordResetCodeExpires).toBeNull();
    });

    it('should not update password for non-existent email', async () => {
      // Should not throw error, just do nothing
      await expect(updatePasswordAndClearReset('nonexistent@example.com', {
        passwordHash: 'new-hash',
      })).resolves.toBeUndefined();
    });
  });
});
