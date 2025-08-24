import type { UserApiResponse, UserProfileFormData } from '../schemas';
import { describe, expect, it } from 'vitest';
import { mapApiResponseToDisplay, mapFormDataToApiRequest } from '../mapper-client';

describe('mapper-client', () => {
  const apiResponse: UserApiResponse = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer',
    image: 'profile.jpg',
    imagePublicId: 'public-id-123',
    emailVerified: '2025-01-01T00:00:00.000Z',
  };

  describe('mapApiResponseToDisplay', () => {
    it('converts emailVerified string to Date object', () => {
      const display = mapApiResponseToDisplay(apiResponse);
      expect(display.emailVerified).toBeInstanceOf(Date);
      expect(display.emailVerified?.toISOString()).toBe(apiResponse.emailVerified);
    });

    it('preserves all fields correctly', () => {
      const display = mapApiResponseToDisplay(apiResponse);
      expect(display.id).toBe('1');
      expect(display.name).toBe('John Doe');
      expect(display.email).toBe('john@example.com');
      expect(display.bio).toBe('Software developer');
      expect(display.image).toBe('profile.jpg');
      expect(display.imagePublicId).toBe('public-id-123');
    });

    it('handles undefined emailVerified', () => {
      const apiResponseWithoutDate = { ...apiResponse, emailVerified: undefined };
      const display = mapApiResponseToDisplay(apiResponseWithoutDate);
      expect(display.emailVerified).toBeUndefined();
    });

    it('handles null emailVerified', () => {
      const apiResponseWithNull = { ...apiResponse, emailVerified: null as any };
      const display = mapApiResponseToDisplay(apiResponseWithNull);
      expect(display.emailVerified).toBeUndefined();
    });
  });

  describe('mapFormDataToApiRequest', () => {
    it('maps form data to API request format', () => {
      const formData: UserProfileFormData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        bio: 'Product manager',
      };

      const apiRequest = mapFormDataToApiRequest(formData);

      expect(apiRequest).toEqual({
        name: 'Jane Smith',
        bio: 'Product manager',
      });
    });

    it('excludes email from API request', () => {
      const formData: UserProfileFormData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        bio: 'Product manager',
      };

      const apiRequest = mapFormDataToApiRequest(formData);

      expect(apiRequest).not.toHaveProperty('email');
      expect(apiRequest.name).toBe('Jane Smith');
      expect(apiRequest.bio).toBe('Product manager');
    });
  });
});
