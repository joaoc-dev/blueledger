export const GROUP_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const GROUP_STATUS_VALUES = [
  GROUP_STATUS.ACTIVE,
  GROUP_STATUS.INACTIVE,
] as const;

export type GroupStatus = (typeof GROUP_STATUS_VALUES)[number];

export const GROUP_ROLES = {
  OWNER: 'owner',
  MEMBER: 'member',
} as const;

export const GROUP_ROLES_VALUES = [
  GROUP_ROLES.OWNER,
  GROUP_ROLES.MEMBER,
] as const;

export type GroupRole = (typeof GROUP_ROLES_VALUES)[number];

export const GROUP_MEMBERSHIP_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  CANCELED: 'canceled',
  REMOVED: 'removed',
  LEFT: 'left',
} as const;

export const GROUP_MEMBERSHIP_STATUS_VALUES = [
  GROUP_MEMBERSHIP_STATUS.PENDING,
  GROUP_MEMBERSHIP_STATUS.ACCEPTED,
  GROUP_MEMBERSHIP_STATUS.DECLINED,
  GROUP_MEMBERSHIP_STATUS.CANCELED,
  GROUP_MEMBERSHIP_STATUS.REMOVED,
  GROUP_MEMBERSHIP_STATUS.LEFT,
] as const;

export type GroupMembershipStatus = (typeof GROUP_MEMBERSHIP_STATUS_VALUES)[number];
