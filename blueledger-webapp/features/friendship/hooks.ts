import type { UserDisplay } from '../users/schemas';
import type { FriendshipDisplay } from './schemas';
import { useMutation } from '@tanstack/react-query';
import posthog from 'posthog-js';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { friendshipKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { acceptFriendshipInvite, sendFriendshipInvite } from './client';
import { FRIENDSHIP_STATUS } from './constants';

interface FriendshipsContext {
  previousFriendships: FriendshipDisplay[];
  optimisticFriendship?: FriendshipDisplay;
}

export function useFriendships() {
  const queryClient = getQueryClient();

  function sortByDateDesc(friendships: FriendshipDisplay[]): FriendshipDisplay[] {
    return [...friendships].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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
      friendships?.map(friendship => (friendship.id === id ? mutationResult : friendship)));
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

      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ACCEPTED_SUCCESS, {
        action: 'accept friend request',
      });
    },
    onError: (error, friendship, context) => {
      console.error('Failed to send friend request: ', error, friendship.id);
      rollbackMutation(context?.previousFriendships);
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ACCEPTED_ERROR, { action: 'accept friend request' });
    },
  });

  return {
    inviteMutation,
    acceptMutation,
  };
}
