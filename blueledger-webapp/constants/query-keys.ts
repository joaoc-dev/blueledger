export const expenseKeys = {
  byUser: ['expenses', 'user'] as const,
};

export const notificationKeys = {
  byUser: ['notifications', 'user'] as const,
};

export const friendshipKeys = {
  byUser: ['friendships', 'user'] as const,
};

export const dashboardKeys = {
  charts: ['dashboard', 'charts'] as const,
};

export const groupMembershipKeys = {
  byUser: ['memberships', 'user'] as const,
  memberships: (groupId: string) => ['groups', groupId, 'memberships'] as const,
  membershipCheck: (groupId: string, email: string) => ['groups', groupId, 'memberships', 'check', email] as const,
  membershipsManagement: (groupId: string) => ['groups', groupId, 'memberships', 'management'] as const,
  membershipsTransfer: (groupId: string) => ['groups', groupId, 'memberships', 'transfer'] as const,
  membershipsView: (groupId: string) => ['groups', groupId, 'memberships', 'view'] as const,
  invitableFriends: (groupId: string) => ['groups', groupId, 'invitable-friends'] as const,
};
