import type {
  PasswordResetConfirmData,
  PasswordResetFormData,
  SignupFormData,
} from '../schemas';

import { beforeEach, describe, expect, it } from 'vitest';
import {
  apiValidationCodeSchema,
  passwordResetConfirmSchema,
  passwordResetFormSchema,
  signInSchema,
  signupFormSchema,
} from '../schemas';

describe('auth schemas', () => {
  describe('apiValidationCodeSchema', () => {
    it('should accept valid codes', () => {
      expect(() => apiValidationCodeSchema.parse({ code: '123456' })).not.toThrow();
    });

    it('should reject non-numeric codes', () => {
      expect(() => apiValidationCodeSchema.parse({ code: 'abc123' })).toThrow();
    });

    it('should reject codes that are too long', () => {
      expect(() => apiValidationCodeSchema.parse({ code: '1234567890' })).toThrow();
    });

    it('should reject codes that are too short', () => {
      expect(() => apiValidationCodeSchema.parse({ code: '123' })).toThrow();
    });
  });

  describe('passwordResetFormSchema', () => {
    let validForm: PasswordResetFormData;

    beforeEach(() => {
      validForm = {
        email: 'a@a.com',
        code: '123456',
        newPassword: '12345678',
        confirmPassword: '12345678',
      };
    });

    it('should require a valid email', () => {
      validForm.email = 'bad';
      expect(() => passwordResetFormSchema.parse(validForm)).toThrow();
    });

    it('should require a code', () => {
      validForm.code = '';
      expect(() => passwordResetFormSchema.parse(validForm)).toThrow();
    });

    it('should require a new password', () => {
      validForm.newPassword = '';
      expect(() => passwordResetFormSchema.parse(validForm)).toThrow();
    });

    it('should require a confirm password', () => {
      validForm.confirmPassword = '';
      expect(() => passwordResetFormSchema.parse(validForm)).toThrow();
    });

    it('should enforce matching passwords', () => {
      validForm.confirmPassword = '123';
      expect(() => passwordResetFormSchema.parse(validForm)).toThrow();
    });

    it('should pass if a valid form is provided', () => {
      expect(() => passwordResetFormSchema.parse(validForm)).not.toThrow();
    });
  });

  describe('passwordResetConfirmSchema', () => {
    let validForm: PasswordResetConfirmData;

    beforeEach(() => {
      validForm = {
        email: 'a@a.com',
        code: '123456',
        newPassword: '12345678',
      };
    });

    it('should require a valid email', () => {
      validForm.email = 'bad';
      expect(() => passwordResetConfirmSchema.parse(validForm)).toThrow();
    });

    it('should require a code', () => {
      validForm.code = '';
      expect(() => passwordResetConfirmSchema.parse(validForm)).toThrow();
    });

    it('should require a new password', () => {
      validForm.newPassword = '';
      expect(() => passwordResetConfirmSchema.parse(validForm)).toThrow();
    });

    it('should pass if a valid form is provided', () => {
      expect(() => passwordResetConfirmSchema.parse(validForm)).not.toThrow();
    });
  });

  describe('signInSchema', () => {
    it('should require a valid email', () => {
      expect(() => signInSchema.parse({ email: 'bad', password: 'x' })).toThrow();
    });

    it('should require a password', () => {
      expect(() => signInSchema.parse({ email: 'a@a.com', password: '' })).toThrow();
    });

    it('should pass if a valid form is provided', () => {
      expect(() => signInSchema.parse({ email: 'a@a.com', password: 'x' })).not.toThrow();
    });
  });

  describe('signupFormSchema', () => {
    let validForm: SignupFormData;

    beforeEach(() => {
      validForm = {
        name: 'n',
        email: 'a@a.com',
        password: '12345678',
        confirmPassword: '12345678',
      };
    });

    it('should require a name', () => {
      validForm.name = '';
      expect(() => signupFormSchema.parse(validForm)).toThrow();
    });

    it('should require a valid email', () => {
      validForm.email = 'bad';
      expect(() => signupFormSchema.parse(validForm)).toThrow();
    });

    it('should require a password', () => {
      validForm.password = '';
      expect(() => signupFormSchema.parse(validForm)).toThrow();
    });

    it('should require a confirm password', () => {
      validForm.confirmPassword = '';
      expect(() => signupFormSchema.parse(validForm)).toThrow();
    });

    it('should enforce matching passwords', () => {
      validForm.confirmPassword = '123';
      expect(() => signupFormSchema.parse(validForm)).toThrow();
    });

    it('should pass if a valid form is provided', () => {
      expect(() => signupFormSchema.parse(validForm)).not.toThrow();
    });
  });
});
