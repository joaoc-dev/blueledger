import type { UserDisplay } from '../users/schemas';
import type { FriendshipDisplay } from './schemas';
import { useMutation } from '@tanstack/react-query';
import posthog from 'posthog-js';
import { v4 as uuidv4 } from 'uuid';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { friendshipKeys } from '@/constants/query-keys';
import { getQueryClient } from '@/lib/react-query/get-query-client';
import { sendFriendshipInvite } from './client';
import { FRIENDSHIP_STATUS } from './constants';

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

  const rollbackMutation = (previousFriendships: FriendshipDisplay[] | undefined) => {
    if (!previousFriendships)
      return;

    queryClient.setQueryData<FriendshipDisplay[]>(
      friendshipKeys.byUser,
      previousFriendships,
    );
  };

  const inviteMutation = useMutation({
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
    onSuccess: (mutationResult, _email, context) => {
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
    onError: (error, email, context) => {
      console.error('Failed to send friend request: ', error, email);
      rollbackMutation(context?.previousFriendships);
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ERROR, { action: 'send friend request' });
    },
  });

  return {
    inviteMutation,
  };
}
