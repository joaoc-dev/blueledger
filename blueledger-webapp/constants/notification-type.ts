export const NotificationTypes = {
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  ADDED_TO_EXPENSE: 'ADDED_TO_EXPENSE',
  GROUP_INVITE: 'GROUP_INVITE',
} as const;

export type NotificationTypeKey = keyof typeof NotificationTypes;
