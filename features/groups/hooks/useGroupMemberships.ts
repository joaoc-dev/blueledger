'use client';

import type { GroupMembershipDisplay } from '../schemas';
import { useMutation } from '@tanstack/react-query';
import posthog from 'posthog-js';

import { AnalyticsEvents } from '@/constants/analytics-events';
import { groupMembershipKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { acceptGroupMembership, cancelGroupInvite, declineGroupInvite, inviteToGroup, kickGroupMember, leaveGroup } from '../client';
import { GROUP_MEMBERSHIP_STATUS } from '../constants';

interface GroupsContext {
  previousGroups: GroupMembershipDisplay[];
  optimisticGroup?: GroupMembershipDisplay;
}

export function useGroupMemberships() {
  const queryClient = getQueryClient();

  function sortByDateDesc(groups: GroupMembershipDisplay[]): GroupMembershipDisplay[] {
    return [...groups].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  const applyOptimisticMutation = async (
    updateQueryFunction: (groups: GroupMembershipDisplay[]) => GroupMembershipDisplay[],
    optimisticGroup?: GroupMembershipDisplay,
  ) => {
    await queryClient.cancelQueries({ queryKey: groupMembershipKeys.byUser });

    const previousGroups
      = queryClient.getQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser) || [];

    const updatedGroups = updateQueryFunction(previousGroups);

    queryClient.setQueryData<GroupMembershipDisplay[]>(
      groupMembershipKeys.byUser,
      updatedGroups,
    );

    return { previousGroups, optimisticGroup };
  };

  const applyUpdateMutationResult = (
    mutationResult: GroupMembershipDisplay,
    optimisticId: string,
  ) => {
    queryClient.setQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser, groups =>
      groups?.map(group =>
        (group as GroupMembershipDisplay).optimisticId === optimisticId ? mutationResult : group));
  };

  const rollbackMutation = (previousGroups: GroupMembershipDisplay[] | undefined) => {
    if (!previousGroups)
      return;

    queryClient.setQueryData<GroupMembershipDisplay[]>(
      groupMembershipKeys.byUser,
      previousGroups,
    );
  };

  const acceptMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    GroupMembershipDisplay,
    GroupsContext
  >({
    mutationFn: (groupMembership: GroupMembershipDisplay) =>
      acceptGroupMembership(groupMembership.group.id!, groupMembership.id!),
    onMutate: async (groupMembership: GroupMembershipDisplay) => {
      const optimisticGroupMembership: GroupMembershipDisplay = {
        ...groupMembership,
        acceptedAt: new Date(),
        updatedAt: new Date(),
        status: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
        group: {
          ...groupMembership.group,
          memberCount: groupMembership.group.memberCount + 1, // Optimistically increment member count
          memberSince: new Date(),
        },
      };

      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        sortByDateDesc(
          groups.map(g =>
            g.id === groupMembership.id ? optimisticGroupMembership : g,
          ),
        );

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticGroupMembership,
      );
    },
    onSuccess: async (mutationResult, groupMembership, context) => {
      if (!context?.optimisticGroup)
        return;

      applyUpdateMutationResult(
        mutationResult,
        groupMembership.id!,
      );

      // Invalidate related queries after accepting membership
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsManagement(groupMembership.group.id!),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsView(groupMembership.group.id!),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.byUser,
        }),
      ]);

      posthog.capture(AnalyticsEvents.GROUP_INVITE_ACCEPT_SUCCESS, {
        action: 'accept group membership',
      });
    },
    onError: (error, groupMembership, context) => {
      console.error('Failed to accept group membership: ', error, groupMembership.id);

      // Check for specific error cases that require removing the friendship from the list
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400) {
          // Remove the membership from the list
          queryClient.setQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser, groups =>
            groups?.filter(g => g.id !== groupMembership.id));

          const errorMessage = apiError.status === 404
            ? 'group_membership_not_found'
            : 'group_membership_status_changed';

          posthog.capture(AnalyticsEvents.GROUP_INVITE_ACCEPT_ERROR, {
            action: 'accept group membership',
            error: errorMessage,
          });

          return;
        }
      }

      // For other errors, rollback the optimistic update
      rollbackMutation(context?.previousGroups);
      posthog.capture(AnalyticsEvents.GROUP_INVITE_ACCEPT_ERROR, {
        action: 'accept group membership',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const declineMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    GroupMembershipDisplay,
    GroupsContext
  >({
    mutationFn: (groupMembership: GroupMembershipDisplay) =>
      declineGroupInvite(groupMembership.group.id!, groupMembership.id!),
    onMutate: async (groupMembership: GroupMembershipDisplay) => {
      // For decline, we optimistically remove from list immediately
      await queryClient.cancelQueries({ queryKey: groupMembershipKeys.byUser });

      const previousGroups = queryClient.getQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser) || [];
      const updatedGroups = previousGroups.filter(g => g.id !== groupMembership.id);

      queryClient.setQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser, updatedGroups);

      return { previousGroups };
    },
    onSuccess: async (_mutationResult, groupMembership, _context) => {
      // Keep it removed from the list and invalidate related queries
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsManagement(groupMembership.group.id!),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsView(groupMembership.group.id!),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.byUser,
        }),
      ]);

      posthog.capture(AnalyticsEvents.GROUP_INVITE_DECLINE_SUCCESS, {
        action: 'decline group membership',
        groupId: groupMembership.group.id,
        groupName: groupMembership.group.name,
      });
    },
    onError: (error, groupMembership, context) => {
      console.error('Failed to decline group membership: ', error, groupMembership.id);

      // Check for specific error cases
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400) {
          // Already removed from list, keep it removed
          const errorMessage = apiError.status === 404
            ? 'group_membership_not_found'
            : 'group_membership_status_changed';

          posthog.capture(AnalyticsEvents.GROUP_INVITE_DECLINE_ERROR, {
            action: 'decline group membership',
            error: errorMessage,
          });
          return;
        }
      }

      // For other errors, add it back to the list
      if (context?.previousGroups) {
        queryClient.setQueryData<GroupMembershipDisplay[]>(
          groupMembershipKeys.byUser,
          context.previousGroups,
        );
      }

      posthog.capture(AnalyticsEvents.GROUP_INVITE_DECLINE_ERROR, {
        action: 'decline group membership',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const leaveGroupMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    GroupMembershipDisplay,
    GroupsContext
  >({
    mutationFn: (groupMembership: GroupMembershipDisplay) =>
      leaveGroup(groupMembership.group.id!, groupMembership.id!),

    onMutate: async (groupMembership: GroupMembershipDisplay) => {
      // For leave group, we optimistically remove from list immediately
      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        groups.filter(g => g.id !== groupMembership.id);

      return await applyOptimisticMutation(updateQueryFunction);
    },

    onSuccess: async (_mutationResult, groupMembership) => {
      // Invalidate related queries after leaving group
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsManagement(groupMembership.group.id!),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsView(groupMembership.group.id!),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.byUser,
        }),
      ]);

      posthog.capture(AnalyticsEvents.GROUP_LEAVE_SUCCESS, {
        groupId: groupMembership.group.id,
        groupName: groupMembership.group.name,
      });
    },

    onError: (error, groupMembership, context) => {
      console.error('Failed to leave group: ', error, groupMembership.id);

      // Check for specific error cases
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 400) {
          // For these errors, the membership might not exist or user can't leave, so keep it removed
          posthog.capture(AnalyticsEvents.GROUP_LEAVE_ERROR, {
            groupId: groupMembership.group.id,
            error: apiError.status === 404
              ? 'membership_not_found'
              : apiError.status === 403
                ? 'permission_denied'
                : 'invalid_status',
          });
          return;
        }
      }

      // For other errors, add it back to the list
      rollbackMutation(context?.previousGroups);
      posthog.capture(AnalyticsEvents.GROUP_LEAVE_ERROR, {
        groupId: groupMembership.group.id,
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const cancelInviteMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    { groupId: string; membershipId: string; memberEmail: string },
    GroupsContext
  >({
    mutationFn: ({ groupId, membershipId }) =>
      cancelGroupInvite(groupId, membershipId),

    onMutate: async ({ membershipId }) => {
      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        groups.filter(g => g.id !== membershipId);

      return await applyOptimisticMutation(updateQueryFunction);
    },

    onSuccess: async (_mutationResult, { groupId, memberEmail }) => {
      // Invalidate all related queries after canceling invite
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsManagement(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsView(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsTransfer(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.byUser,
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.invitableFriends(groupId),
        }),
      ]);

      posthog.capture(AnalyticsEvents.GROUP_INVITE_CANCEL_SUCCESS, {
        action: 'cancel invite',
        memberEmail,
      });
    },

    onError: (error, _variables, context) => {
      console.error('Failed to cancel invite:', error);
      rollbackMutation(context?.previousGroups);
      posthog.capture(AnalyticsEvents.GROUP_INVITE_CANCEL_ERROR, {
        action: 'cancel invite',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const transferOwnershipMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    { groupId: string; membershipId: string; memberName: string },
    GroupsContext
  >({
    mutationFn: ({ groupId, membershipId }) =>
      fetch(`/api/groups/${groupId}/transfer`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserMembershipId: membershipId,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to transfer ownership');
        }
        return response.json();
      }),

    onMutate: async ({ membershipId }) => {
      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        groups.filter(g => g.id !== membershipId);

      return await applyOptimisticMutation(updateQueryFunction);
    },

    onSuccess: async (_mutationResult, { groupId, memberName }) => {
      // Invalidate all related queries after ownership transfer
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsTransfer(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsManagement(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsView(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.byUser,
        }),
      ]);

      posthog.capture(AnalyticsEvents.GROUP_MEMBERSHIP_TRANSFER_OWNERSHIP_SUCCESS, {
        action: 'transfer ownership',
        memberName,
      });
    },

    onError: (error, _variables, context) => {
      console.error('Failed to transfer ownership:', error);
      rollbackMutation(context?.previousGroups);
      posthog.capture(AnalyticsEvents.GROUP_MEMBERSHIP_TRANSFER_OWNERSHIP_ERROR, {
        action: 'transfer ownership',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const kickMemberMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    { groupId: string; membershipId: string; memberName: string },
    GroupsContext
  >({
    mutationFn: ({ groupId, membershipId }) =>
      kickGroupMember(groupId, membershipId),

    onMutate: async ({ membershipId }) => {
      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        groups.filter(g => g.id !== membershipId);

      return await applyOptimisticMutation(updateQueryFunction);
    },

    onSuccess: async (_mutationResult, { groupId, memberName }) => {
      // Invalidate all related queries after kicking member
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsManagement(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsView(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsTransfer(groupId),
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.byUser,
        }),
      ]);

      posthog.capture(AnalyticsEvents.GROUP_MEMBERSHIP_KICK_SUCCESS, {
        action: 'kick member',
        memberName,
      });
    },

    onError: (error, _variables, context) => {
      console.error('Failed to kick member:', error);
      rollbackMutation(context?.previousGroups);
      posthog.capture(AnalyticsEvents.GROUP_MEMBERSHIP_KICK_ERROR, {
        action: 'kick member',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const inviteMemberMutation = useMutation<
    { success: boolean; membershipId?: string },
    Error,
    { groupId: string; email: string; friendName: string },
    undefined
  >({
    mutationFn: ({ groupId, email }) =>
      inviteToGroup(groupId, { email }),

    onSuccess: async (_mutationResult, { groupId, friendName }) => {
      // Invalidate related queries to refresh UI immediately
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsManagement(groupId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.membershipsView(groupId),
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: groupMembershipKeys.invitableFriends(groupId),
          exact: true,
        }),
      ]);

      posthog.capture(AnalyticsEvents.GROUP_FRIEND_INVITE_SUCCESS, {
        action: 'invite member',
        friendName,
      });
    },

    onError: (error, _variables) => {
      console.error('Failed to invite member:', error);
      posthog.capture(AnalyticsEvents.GROUP_FRIEND_INVITE_ERROR, {
        action: 'invite member',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  return {
    acceptMutation,
    declineMutation,
    leaveGroupMutation,
    cancelInviteMutation,
    kickMemberMutation,
    transferOwnershipMutation,
    inviteMemberMutation,
  };
}
