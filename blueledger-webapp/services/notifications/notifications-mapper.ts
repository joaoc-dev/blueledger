import { NotificationTypeKey } from '@/constants/notification-type';
import { NotificationType } from '@/types/notification';
import { UserType } from '@/types/user';

export interface NotificationApiResponse {
  id: string;
  user: Partial<UserType>;
  fromUser: Partial<UserType>;
  type: NotificationTypeKey;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationApiRequest {
  isRead: boolean;
}

export class NotificationMapper {
  static toType(apiResponse: NotificationApiResponse): NotificationType {
    return {
      ...apiResponse,
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
