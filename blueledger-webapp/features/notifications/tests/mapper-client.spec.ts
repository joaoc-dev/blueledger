import type { NotificationApiResponse } from '../schemas';
import { describe, expect, it } from 'vitest';
import { NOTIFICATION_TYPES } from '../constants';
import { mapApiResponseListToDisplay, mapApiResponseToDisplay } from '../mapper-client';

describe('mapper-client', () => {
  const apiResponse: NotificationApiResponse = {
    id: '1',
    user: { id: 'u1', name: 'User One', image: 'image1.jpg' },
    fromUser: { id: 'u2', name: 'User Two', image: 'image2.jpg' },
    type: NOTIFICATION_TYPES.FRIEND_REQUEST,
    isRead: false,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z',
  };

  describe('mapApiResponseToDisplay', () => {
    it('converts date strings to Date objects', () => {
      const display = mapApiResponseToDisplay(apiResponse);
      expect(display.createdAt).toBeInstanceOf(Date);
      expect(display.updatedAt).toBeInstanceOf(Date);

      expect(display.createdAt.toISOString()).toBe(apiResponse.createdAt);
      expect(display.updatedAt.toISOString()).toBe(apiResponse.updatedAt);
    });

    it('preserves other fields correctly', () => {
      const display = mapApiResponseToDisplay(apiResponse);
      expect(display.id).toBe(apiResponse.id);
      expect(display.user).toEqual(apiResponse.user);
      expect(display.fromUser).toEqual(apiResponse.fromUser);
      expect(display.type).toBe(apiResponse.type);
      expect(display.isRead).toBe(apiResponse.isRead);
    });
  });

  describe('mapApiResponseListToDisplay', () => {
    it('maps an array of responses correctly', () => {
      const list = [apiResponse, apiResponse];

      const displayList = mapApiResponseListToDisplay(list);

      expect(displayList).toHaveLength(2);
      displayList.forEach((d, i) => {
        expect(d).toHaveProperty('id', list[i]?.id);
        expect(d.type).toBe(list[i]?.type);
        expect(d.createdAt).toBeInstanceOf(Date);
        expect(d.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('returns empty array for empty input', () => {
      const displayList = mapApiResponseListToDisplay([]);
      expect(displayList).toEqual([]);
    });
  });
});
