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

export const notificationsUnread: Notification[] = [
  {
    id: 1,
    userId: '11',
    type: 'FRIEND_REQUEST',
    timestamp: minusXMinutes(5),
    isRead: false,
  },
  {
    id: 2,
    userId: '1',
    type: 'GROUP_INVITE',
    timestamp: minusXMinutes(12),
    isRead: false,
  },
  {
    id: 3,
    userId: '12',
    type: 'ADDED_TO_EXPENSE',
    timestamp: minusXMinutes(32),
    isRead: false,
  },
  {
    id: 4,
    userId: '2',
    type: 'FRIEND_REQUEST',
    timestamp: minusXMinutes(58),
    isRead: false,
  },
  {
    id: 5,
    userId: '13',
    type: 'ADDED_TO_EXPENSE',
    timestamp: minusXHours(1),
    isRead: false,
  },
  {
    id: 6,
    userId: '3',
    type: 'GROUP_INVITE',
    timestamp: minusXHours(2),
    isRead: false,
  },
  {
    id: 7,
    userId: '14',
    type: 'GROUP_INVITE',
    timestamp: minusXHours(2),
    isRead: false,
  },
  {
    id: 8,
    userId: '4',
    type: 'ADDED_TO_EXPENSE',
    timestamp: minusXHours(3),
    isRead: false,
  },
  {
    id: 9,
    userId: '15',
    type: 'GROUP_INVITE',
    timestamp: minusXHours(4),
    isRead: false,
  },
  {
    id: 10,
    userId: '5',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(5),
    isRead: false,
  },
];

export const notificationsRead: Notification[] = [
  {
    id: 11,
    userId: '16',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(6),
    isRead: true,
  },
  {
    id: 12,
    userId: '6',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(7),
    isRead: true,
  },
  {
    id: 13,
    userId: '17',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(8),
    isRead: true,
  },
  {
    id: 14,
    userId: '7',
    type: 'GROUP_INVITE',
    timestamp: minusXHours(8),
    isRead: true,
  },
  {
    id: 15,
    userId: '18',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(9),
    isRead: true,
  },
  {
    id: 16,
    userId: '8',
    type: 'ADDED_TO_EXPENSE',
    timestamp: minusXHours(9),
    isRead: true,
  },
  {
    id: 17,
    userId: '19',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(10),
    isRead: true,
  },
  {
    id: 18,
    userId: '9',
    type: 'GROUP_INVITE',
    timestamp: minusXHours(11),
    isRead: true,
  },
  {
    id: 19,
    userId: '20',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(12),
    isRead: true,
  },
  {
    id: 20,
    userId: '10',
    type: 'FRIEND_REQUEST',
    timestamp: minusXHours(13),
    isRead: true,
  },
];

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
