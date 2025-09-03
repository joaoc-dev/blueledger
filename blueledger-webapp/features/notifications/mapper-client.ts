'use client';

import type { NotificationApiResponse, NotificationDisplay } from './schemas';

export function mapApiResponseToDisplay(
  apiResponse: NotificationApiResponse,
): NotificationDisplay {
  return {
    ...apiResponse,
    createdAt: new Date(apiResponse.createdAt),
    updatedAt: new Date(apiResponse.updatedAt),
  };
}

export function mapApiResponseListToDisplay(
  apiResponses: NotificationApiResponse[],
): NotificationDisplay[] {
  return apiResponses.map(mapApiResponseToDisplay);
}
