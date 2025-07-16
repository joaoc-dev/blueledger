import { NotificationDisplay } from '@/features/notifications.ts/schemas';
import { apiGet, apiPatch } from '../../lib/api-client';
import { NotificationApiResponse } from './schemas';
import { mapApiResponseListToDisplay, mapApiResponseToDisplay } from './mapper';

export async function markNotificationAsRead(
  id: string
): Promise<NotificationDisplay> {
  const response = await apiPatch<NotificationApiResponse>(
    `/notifications/${id}`,
    { isRead: true }
  );

  return mapApiResponseToDisplay(response);
}

export async function getNotifications(): Promise<NotificationDisplay[]> {
  const response = await apiGet<NotificationApiResponse[]>('/notifications');
  return mapApiResponseListToDisplay(response);
}
