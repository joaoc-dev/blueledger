'use client';

import type { GroupFormData, GroupMembershipDisplay } from '../schemas';
import { useMutation } from '@tanstack/react-query';
import { getSession } from 'next-auth/react';
import posthog from 'posthog-js';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { groupMembershipKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import {
  createGroup,
  deleteGroup,
  updateGroup,
} from '../client';
import { GROUP_MEMBERSHIP_STATUS, GROUP_ROLES } from '../constants';

/**
 * Retrieves the current authenticated user from the session.
 * Used to populate optimistic updates with user information.
 *
 * @throws {Error} If user is not authenticated
 * @returns Current user information from session
 */
async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  return {
    id: session.user.id,
    name: session.user.name || '',
    email: session.user.email || '',
    image: session.user.image || undefined,
  };
}

/**
 * Context object passed between mutation lifecycle methods.
 * Used to store previous state for potential rollback and optimistic data.
 */
interface GroupsContext {
  previousGroups: GroupMembershipDisplay[];
  optimisticGroup?: GroupMembershipDisplay;
}

/**
 * Custom hook for managing group operations with optimistic updates.
 * Provides mutations for creating, updating, and deleting groups with
 * immediate UI feedback and automatic rollback on errors.
 */
export function useGroups() {
  const queryClient = getQueryClient();

  /**
   * Sorts groups by most recent activity (member since date or creation date).
   * Used to maintain consistent ordering in the UI after optimistic updates.
   *
   * @param groups Array of group memberships to sort
   * @returns Sorted array with most recent groups first
   */
  function sortByDateDesc(groups: GroupMembershipDisplay[]): GroupMembershipDisplay[] {
    return [...groups].sort(
      (a, b) =>
        new Date(b.group.memberSince || b.createdAt).getTime()
          - new Date(a.group.memberSince || a.createdAt).getTime(),
    );
  }

  /**
   * Applies optimistic updates to the React Query cache.
   * Cancels ongoing queries, stores previous state for rollback, and applies the update.
   *
   * @param updateQueryFunction Function that modifies the groups array
   * @param optimisticGroup Optional optimistic group data for context
   * @returns Context object with previous state and optimistic data
   */
  const applyOptimisticMutation = async (
    updateQueryFunction: (groups: GroupMembershipDisplay[]) => GroupMembershipDisplay[],
    optimisticGroup?: GroupMembershipDisplay,
  ) => {
    // Cancel any ongoing queries to prevent race conditions
    await queryClient.cancelQueries({ queryKey: groupMembershipKeys.byUser });

    // Store previous state for potential rollback
    const previousGroups
      = queryClient.getQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser) || [];

    // Apply the optimistic update
    const updatedGroups = updateQueryFunction(previousGroups);

    // Update the cache with the modified data
    queryClient.setQueryData<GroupMembershipDisplay[]>(
      groupMembershipKeys.byUser,
      updatedGroups,
    );

    return { previousGroups, optimisticGroup };
  };

  /**
   * Replaces optimistic group data with the actual server response after successful creation.
   * Maintains proper sorting order after the real data is received.
   *
   * @param mutationResult The actual group data from the server
   * @param optimisticId The temporary ID used for the optimistic update
   */
  const applyNewMutationResult = (
    mutationResult: GroupMembershipDisplay,
    optimisticId: string,
  ) => {
    queryClient.setQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser, groups =>
      sortByDateDesc(
        groups?.map(group =>
          (group as GroupMembershipDisplay).optimisticId === optimisticId ? mutationResult : group,
        ) || [],
      ));
  };

  /**
   * Replaces optimistic group data with the actual server response after successful update.
   * Preserves the existing order since updates shouldn't change sorting.
   *
   * @param mutationResult The actual updated group data from the server
   * @param optimisticId The temporary ID used for the optimistic update
   */
  const applyUpdateMutationResult = (
    mutationResult: GroupMembershipDisplay,
    optimisticId: string,
  ) => {
    queryClient.setQueryData<GroupMembershipDisplay[]>(groupMembershipKeys.byUser, groups =>
      groups?.map(group =>
        (group as GroupMembershipDisplay).optimisticId === optimisticId ? mutationResult : group));
  };

  /**
   * Rolls back the optimistic update by restoring the previous state.
   * Called when a mutation fails to revert the UI to its previous state.
   *
   * @param previousGroups The groups array before the optimistic update
   */
  const rollbackMutation = (previousGroups: GroupMembershipDisplay[] | undefined) => {
    if (!previousGroups)
      return;

    queryClient.setQueryData<GroupMembershipDisplay[]>(
      groupMembershipKeys.byUser,
      previousGroups,
    );
  };

  /**
   * Mutation for creating a new group with optimistic updates.
   * Immediately shows the new group in the UI while the API call is in progress.
   */
  const addGroupMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    GroupFormData,
    GroupsContext
  >({
    mutationFn: createGroup,

    /**
     * Called before the mutation executes.
     * Creates optimistic group data and updates the cache immediately.
     */
    onMutate: async (newGroup: GroupFormData) => {
      const currentUser = await getCurrentUser();

      // Create optimistic group data with temporary IDs and current user info
      const optimisticGroup: GroupMembershipDisplay = {
        id: uuidv4(), // Temporary ID for the membership
        optimisticId: uuidv4(), // Unique identifier for this optimistic update
        group: {
          id: uuidv4(), // Temporary ID for the group itself
          name: newGroup.name,
          image: newGroup.image || '',
          ownerName: currentUser.name,
          ownerImage: currentUser.image || '',
          memberCount: 1, // Creator is the first member
          memberSince: new Date(), // Current timestamp as member since date
        },
        user: {
          name: currentUser.name,
          email: currentUser.email,
          image: currentUser.image,
        },
        invitedByName: currentUser.name, // Creator invited themselves
        role: GROUP_ROLES.OWNER,
        status: GROUP_MEMBERSHIP_STATUS.ACCEPTED, // Immediately accepted at creation
        createdAt: new Date(),
        updatedAt: new Date(),
        acceptedAt: new Date(), // Immediately accepted at creation
      };

      // Function to add the new group to the beginning of the sorted list
      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        sortByDateDesc([optimisticGroup, ...groups]);

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticGroup,
      );
    },

    /**
     * Called when the mutation succeeds.
     * Replaces optimistic data with real server response after a brief delay.
     */
    onSuccess: async (mutationResult, _newGroup, context) => {
      if (!context?.optimisticGroup)
        return;

      // Replace optimistic data with actual server response
      applyNewMutationResult(
        mutationResult,
        context.optimisticGroup.optimisticId!,
      );

      posthog.capture(AnalyticsEvents.GROUP_CREATE_SUCCESS, {
        action: 'create',
        hasImage: !!mutationResult.group?.image,
      });
    },

    onError: (error, newGroup, context) => {
      console.error('Failed to create group: ', error, newGroup);
      rollbackMutation(context?.previousGroups);

      posthog.capture(AnalyticsEvents.GROUP_CREATE_ERROR, { action: 'create' });
    },
  });

  /**
   * Mutation for updating an existing group with optimistic updates.
   * Immediately shows the updated group in the UI while the API call is in progress.
   */
  const updateGroupMutation = useMutation<
    GroupMembershipDisplay,
    Error,
    { currentUserMembership: GroupMembershipDisplay; updatedGroup: GroupFormData },
    GroupsContext
  >({
    mutationFn: ({ currentUserMembership, updatedGroup }) => updateGroup(currentUserMembership.group.id, updatedGroup),

    /**
     * Called before the update mutation executes.
     * Creates optimistic updated group data and replaces the existing group in the cache.
     */
    onMutate: async ({ currentUserMembership, updatedGroup }) => {
      const currentUser = await getCurrentUser();

      // Create optimistic updated group data with new values
      const optimisticGroup: GroupMembershipDisplay = {
        id: uuidv4(), // New temporary membership ID
        optimisticId: uuidv4(), // Unique identifier for this optimistic update
        group: {
          id: currentUserMembership.group.id,
          name: updatedGroup.name,
          image: updatedGroup.image || '',
          ownerName: currentUserMembership.group.ownerName,
          ownerImage: currentUserMembership.group.ownerImage,
          memberCount: currentUserMembership.group.memberCount,
          memberSince: currentUserMembership.group.memberSince,
        },
        user: {
          name: currentUser.name,
          email: currentUser.email,
          image: currentUser.image,
        },
        invitedByName: currentUserMembership.invitedByName,
        role: GROUP_ROLES.OWNER,
        status: GROUP_MEMBERSHIP_STATUS.ACCEPTED,
        createdAt: new Date(),
        updatedAt: new Date(),
        acceptedAt: new Date(),
      };

      // Function to replace the existing group with the optimistic updated version
      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        groups.map(group =>
          group.group.id === currentUserMembership.group.id ? optimisticGroup : group,
        );

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticGroup,
      );
    },

    /**
     * Called when the update mutation succeeds.
     * Replaces optimistic data with real server response.
     */
    onSuccess: async (mutationResult, _updatedGroup, context) => {
      if (!context?.optimisticGroup)
        return;

      applyUpdateMutationResult(
        mutationResult,
        context.optimisticGroup.optimisticId!,
      );

      posthog.capture(AnalyticsEvents.GROUP_EDIT_SUCCESS, {
        action: 'update',
        hasImage: !!mutationResult.group?.image,
      });
    },

    onError: (error, updatedGroup, context) => {
      console.error('Failed to update group: ', error, updatedGroup);
      rollbackMutation(context?.previousGroups);

      posthog.capture(AnalyticsEvents.GROUP_EDIT_ERROR, { action: 'update' });
    },
  });

  /**
   * Mutation for deleting a group with optimistic updates.
   * Immediately removes the group from the UI while the API call is in progress.
   */
  const deleteGroupMutation = useMutation<
    void,
    Error,
    string,
    GroupsContext
  >({
    mutationFn: deleteGroup,

    /**
     * Called before the delete mutation executes.
     * Removes the group from the cache immediately.
     */
    onMutate: async (groupId: string) => {
      // Function to filter out the deleted group
      const updateQueryFunction = (groups: GroupMembershipDisplay[]) =>
        groups.filter(group => group.group.id !== groupId);

      return await applyOptimisticMutation(updateQueryFunction);
    },

    onSuccess: async (_mutationResult, groupId) => {
      posthog.capture(AnalyticsEvents.GROUP_DELETE_SUCCESS, {
        action: 'delete',
        groupId,
      });
    },

    onError: (error, groupId, context) => {
      console.error('Failed to delete group: ', error, groupId);
      rollbackMutation(context?.previousGroups);

      posthog.capture(AnalyticsEvents.GROUP_DELETE_ERROR, {
        action: 'delete',
        groupId,
      });
    },
  });

  return {
    addGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
  };
}
