import { dummyUsers } from './dummy-users'; // path to your 20-item users mock

export const NotificationTypes = {
  FRIEND_REQUEST: 'FRIEND_REQUEST',
  ADDED_TO_EXPENSE: 'ADDED_TO_EXPENSE',
  GROUP_INVITE: 'GROUP_INVITE',
} as const;

export type NotificationTypeKey = keyof typeof NotificationTypes;

const minusXMinutes = (m: number) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - m);
  return d.toISOString();
};

const minusXHours = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
};

export interface Notification {
  id: number;
  userId: string;
  type: NotificationTypeKey;
  timestamp: string;
  isRead: boolean;
}

export const generateNotifications = (
  count: number,
  isRead: boolean
): Notification[] => {
  const types = Object.keys(NotificationTypes) as NotificationTypeKey[];
  const notifications: Notification[] = [];

  for (let i = 1; i <= count; i++) {
    const userId = Math.floor(Math.random() * dummyUsers.length) + 1;
    const type = types[i % types.length];

    const timestamp = isRead ? minusXHours(i) : minusXMinutes(i);

    notifications.push({
      id: i,
      userId: userId.toString(),
      type,
      timestamp,
      isRead,
    });
  }

  return notifications;
};

const notificationsRead = generateNotifications(10, true);
const notificationsUnread = generateNotifications(10, false);

export interface NotificationWithUser extends Notification {
  userName: string;
  userImage: string;
}

const userMap = new Map(dummyUsers.map((u) => [u.id, u]));

const toNotificationWithUser = (n: Notification): NotificationWithUser => {
  const u = userMap.get(n.userId);
  return {
    ...n,
    userName: u?.name ?? 'Unknown',
    userImage: u?.image ?? '',
  };
};

const toNotificationsWithUser = (n: Notification[]): NotificationWithUser[] => {
  return n.map(toNotificationWithUser);
};

export async function getNotifications(): Promise<NotificationWithUser[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return toNotificationsWithUser([
    ...notificationsUnread,
    ...notificationsRead,
  ]);
}
