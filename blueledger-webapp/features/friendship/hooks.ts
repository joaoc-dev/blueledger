import type { UserDisplay } from '../users/schemas';
import type { FriendshipDisplay } from './schemas';
import { useMutation } from '@tanstack/react-query';
import posthog from 'posthog-js';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { friendshipKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import {
  acceptFriendshipInvite,
  cancelFriendshipInvite,
  declineFriendshipInvite,
  removeFriendship,
  sendFriendshipInvite,
} from './client';
import { FRIENDSHIP_STATUS } from './constants';

interface FriendshipsContext {
  previousFriendships: FriendshipDisplay[];
  optimisticFriendship?: FriendshipDisplay;
}

export function useFriendships() {
  const queryClient = getQueryClient();

  function sortByDateDesc(friendships: FriendshipDisplay[]): FriendshipDisplay[] {
    return [...friendships].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  const applyOptimisticMutation = async (
    updateQueryFunction: (friendships: FriendshipDisplay[]) => FriendshipDisplay[],
    optimisticFriendship?: FriendshipDisplay,
  ) => {
    await queryClient.cancelQueries({ queryKey: friendshipKeys.byUser });

    const previousFriendships
      = queryClient.getQueryData<FriendshipDisplay[]>(friendshipKeys.byUser) || [];

    const updatedFriendships = updateQueryFunction(previousFriendships);

    queryClient.setQueryData<FriendshipDisplay[]>(
      friendshipKeys.byUser,
      updatedFriendships,
    );

    return { previousFriendships, optimisticFriendship };
  };

  const applyNewMutationResult = (
    mutationResult: FriendshipDisplay,
    optimisticId: string,
  ) => {
    queryClient.setQueryData<FriendshipDisplay[]>(friendshipKeys.byUser, friendships =>
      sortByDateDesc(
        friendships?.map(friendship =>
          friendship.optimisticId === optimisticId ? mutationResult : friendship,
        ) || [],
      ));
  };

  const applyUpdateMutationResult = (
    mutationResult: FriendshipDisplay,
    id: string,
  ) => {
    queryClient.setQueryData<FriendshipDisplay[]>(friendshipKeys.byUser, friendships =>
      friendships?.map(friendship => (friendship.id === id ? mutationResult : friendship)) || []);
  };

  const rollbackMutation = (previousFriendships: FriendshipDisplay[] | undefined) => {
    if (!previousFriendships)
      return;

    queryClient.setQueryData<FriendshipDisplay[]>(
      friendshipKeys.byUser,
      previousFriendships,
    );
  };

  const inviteMutation = useMutation<
    FriendshipDisplay,
    Error,
    UserDisplay,
    FriendshipsContext
  >({
    mutationFn: (user: UserDisplay) => sendFriendshipInvite(user.email),
    onMutate: async (user: UserDisplay) => {
      const optimisticFriendship: FriendshipDisplay = {
        id: uuidv4(),
        optimisticId: uuidv4(),
        status: FRIENDSHIP_STATUS.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        recipientName: user.name,
        recipientEmail: user.email,
      };

      const updateQueryFunction = (friendships: FriendshipDisplay[]) =>
        sortByDateDesc([optimisticFriendship, ...friendships]);

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticFriendship,
      );
    },
    onSuccess: (mutationResult, _, context) => {
      if (!context?.optimisticFriendship)
        return;

      applyNewMutationResult(
        mutationResult,
        context.optimisticFriendship.optimisticId!,
      );

      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_SUCCESS, {
        action: 'send friend request',
      });
    },
    onError: (error, user, context) => {
      console.error('Failed to send friend request: ', error, user.email);
      rollbackMutation(context?.previousFriendships);
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ERROR, { action: 'send friend request' });
    },
  });

  const acceptMutation = useMutation<
    FriendshipDisplay,
    Error,
    FriendshipDisplay,
    FriendshipsContext
  >({
    mutationFn: (friendship: FriendshipDisplay) => acceptFriendshipInvite(friendship.id),
    onMutate: async (friendship: FriendshipDisplay) => {
      const optimisticFriendship: FriendshipDisplay = {
        ...friendship,
        acceptedAt: new Date(),
        updatedAt: new Date(),
        status: FRIENDSHIP_STATUS.ACCEPTED,
      };

      const updateQueryFunction = (friendships: FriendshipDisplay[]) =>
        sortByDateDesc(
          friendships.map(f =>
            f.id === friendship.id ? optimisticFriendship : f,
          ),
        );

      return await applyOptimisticMutation(
        updateQueryFunction,
        optimisticFriendship,
      );
    },
    onSuccess: (mutationResult, friendship, context) => {
      if (!context?.optimisticFriendship)
        return;

      applyUpdateMutationResult(
        mutationResult,
        friendship.id,
      );

      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ACCEPT_SUCCESS, {
        action: 'accept friend request',
      });
    },
    onError: (error, friendship, context) => {
      console.error('Failed to accept friend request: ', error, friendship.id);

      // Check for specific error cases that require removing the friendship from the list
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400) {
          // Remove the friendship from the list
          queryClient.setQueryData<FriendshipDisplay[]>(friendshipKeys.byUser, friendships =>
            friendships?.filter(f => f.id !== friendship.id));

          const errorMessage = apiError.status === 404
            ? 'friendship_not_found'
            : 'friendship_status_changed';

          posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ACCEPT_ERROR, {
            action: 'accept friend request',
            error: errorMessage,
          });

          return;
        }
      }

      // For other errors, rollback the optimistic update
      rollbackMutation(context?.previousFriendships);
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ACCEPT_ERROR, {
        action: 'accept friend request',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const declineMutation = useMutation<
    FriendshipDisplay,
    Error,
    FriendshipDisplay,
    FriendshipsContext
  >({
    mutationFn: (friendship: FriendshipDisplay) => declineFriendshipInvite(friendship.id),
    onMutate: async (friendship: FriendshipDisplay) => {
      // For decline, we optimistically remove from list immediately
      await queryClient.cancelQueries({ queryKey: friendshipKeys.byUser });

      const previousFriendships = queryClient.getQueryData<FriendshipDisplay[]>(friendshipKeys.byUser) || [];
      const updatedFriendships = previousFriendships.filter(f => f.id !== friendship.id);

      queryClient.setQueryData<FriendshipDisplay[]>(friendshipKeys.byUser, updatedFriendships);

      return { previousFriendships };
    },
    onSuccess: (_mutationResult, _friendship, _context) => {
      // Keep it removed from the list
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_DECLINE_SUCCESS, {
        action: 'decline friend request',
      });
    },
    onError: (error, friendship, context) => {
      console.error('Failed to decline friend request: ', error, friendship.id);

      // Check for specific error cases
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400) {
          // Already removed from list, keep it removed
          const errorMessage = apiError.status === 404
            ? 'friendship_not_found'
            : 'friendship_status_changed';

          posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_DECLINE_ERROR, {
            action: 'cancel friend request',
            error: errorMessage,
          });
          return;
        }
      }

      // For other errors, add it back to the list
      if (context?.previousFriendships) {
        queryClient.setQueryData<FriendshipDisplay[]>(
          friendshipKeys.byUser,
          context.previousFriendships,
        );
      }

      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_DECLINE_ERROR, {
        action: 'decline friend request',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const cancelMutation = useMutation<
    FriendshipDisplay,
    Error,
    FriendshipDisplay,
    FriendshipsContext
  >({
    mutationFn: (friendship: FriendshipDisplay) => cancelFriendshipInvite(friendship.id),
    onMutate: async (friendship: FriendshipDisplay) => {
      // For decline, we optimistically remove from list immediately
      await queryClient.cancelQueries({ queryKey: friendshipKeys.byUser });

      const previousFriendships = queryClient.getQueryData<FriendshipDisplay[]>(friendshipKeys.byUser) || [];
      const updatedFriendships = previousFriendships.filter(f => f.id !== friendship.id);

      queryClient.setQueryData<FriendshipDisplay[]>(friendshipKeys.byUser, updatedFriendships);

      return { previousFriendships };
    },
    onSuccess: (_mutationResult, _friendship, _context) => {
      // Keep it removed from the list
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_CANCEL_SUCCESS, {
        action: 'cancel friend request',
      });
    },
    onError: (error, friendship, context) => {
      console.error('Failed to cancel friend request: ', error, friendship.id);

      // Check for specific error cases
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400) {
          // Already removed from list, keep it removed
          const errorMessage = apiError.status === 404
            ? 'friendship_not_found'
            : 'friendship_status_changed';

          posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_CANCEL_ERROR, {
            action: 'cancel friend request',
            error: errorMessage,
          });
          return;
        }
      }

      // For other errors, add it back to the list
      if (context?.previousFriendships) {
        queryClient.setQueryData<FriendshipDisplay[]>(
          friendshipKeys.byUser,
          context.previousFriendships,
        );
      }

      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_CANCEL_ERROR, {
        action: 'cancel friend request',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  const removeMutation = useMutation<
    FriendshipDisplay,
    Error,
    FriendshipDisplay,
    FriendshipsContext
  >({
    mutationFn: (friendship: FriendshipDisplay) => removeFriendship(friendship.id),
    onMutate: async (friendship: FriendshipDisplay) => {
      // For remove, we optimistically remove from list immediately
      await queryClient.cancelQueries({ queryKey: friendshipKeys.byUser });

      const previousFriendships = queryClient.getQueryData<FriendshipDisplay[]>(friendshipKeys.byUser) || [];
      const updatedFriendships = previousFriendships.filter(f => f.id !== friendship.id);

      queryClient.setQueryData<FriendshipDisplay[]>(friendshipKeys.byUser, updatedFriendships);

      return { previousFriendships };
    },
    onSuccess: (_mutationResult, _friendship, _context) => {
      // Keep it removed from the list
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_REMOVE_SUCCESS, {
        action: 'remove friendship',
      });
    },
    onError: (error, friendship, context) => {
      console.error('Failed to remove friendship: ', error, friendship.id);

      // Check for specific error cases
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400 || apiError.status === 403) {
          // Already removed from list, keep it removed
          const errorMessage = apiError.status === 404
            ? 'friendship_not_found'
            : apiError.status === 400
              ? 'friendship_cannot_be_removed'
              : 'unauthorized';

          posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_REMOVE_ERROR, {
            action: 'remove friendship',
            error: errorMessage,
          });
          return;
        }
      }

      // For other errors, add it back to the list
      if (context?.previousFriendships) {
        queryClient.setQueryData<FriendshipDisplay[]>(
          friendshipKeys.byUser,
          context.previousFriendships,
        );
      }

      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_REMOVE_ERROR, {
        action: 'remove friendship',
        error: error instanceof Error ? error.message : 'unknown_error',
      });
    },
  });

  return {
    inviteMutation,
    acceptMutation,
    declineMutation,
    cancelMutation,
    removeMutation,
  };
}
