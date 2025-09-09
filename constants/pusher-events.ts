export const PusherEvents = {
  NOTIFICATION: 'notification',
} as const;

export type PusherEvent = (typeof PusherEvents)[keyof typeof PusherEvents];
