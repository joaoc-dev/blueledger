import { NotificationType } from '@/types/notification';
import { apiGet } from '../api-client';
import { NotificationApiResponse } from './notifications-mapper';
import { UserType } from '@/types/user';
import { NotificationTypeKey } from '@/constants/notification-type';

export async function getNotifications(): Promise<NotificationType[]> {
  const response = await apiGet<NotificationApiResponse[]>('/notifications');
  return NotificationMapper.toTypeList(response);
}

export class NotificationMapper {
  static toType(apiResponse: NotificationApiResponse): NotificationType {
    return {
      ...apiResponse,
      user: apiResponse.user as UserType,
      fromUser: apiResponse.fromUser as UserType,
      type: apiResponse.type as unknown as NotificationTypeKey,
      createdAt: new Date(apiResponse.createdAt),
      updatedAt: new Date(apiResponse.updatedAt),
    };
  }

  static toTypeList(
    apiResponses: NotificationApiResponse[]
  ): NotificationType[] {
    return apiResponses.map(this.toType);
  }
}
