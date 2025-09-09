import type { UserDisplay } from '@/features/users/schemas';
import { UserPlus } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { FRIENDSHIP_STATUS } from '@/features/friendship/constants';
import { useFriendships } from '../../hooks';

interface AddFriendPanelProps {
  user: UserDisplay;
  onSuccess: () => void;
}

function AddFriendPanel({ user, onSuccess }: AddFriendPanelProps) {
  const { inviteMutation } = useFriendships();

  const isSelf = user.isSelf;
  const isFriend = user.friendshipStatus === FRIENDSHIP_STATUS.ACCEPTED;
  const isPending = user.friendshipStatus === FRIENDSHIP_STATUS.PENDING;

  const isDisabled = isSelf || isFriend || isPending;
  const statusText = isSelf
    ? 'You cannot add yourself as a friend.'
    : isFriend
      ? 'You are already friends.'
      : isPending
        ? 'You have a pending friend request.'
        : 'Add friend.';

  const handleAddFriend = async () => {
    const toastId = uuidv4();

    toast.loading(`Adding friend...`, { id: toastId });

    try {
      posthog.capture(AnalyticsEvents.FRIENDSHIP_ADD_CLICKED, {
        action: 'send friend request',
      });

      await inviteMutation?.mutateAsync(user);

      toast.success(`Friend request sent`, { id: toastId });
      onSuccess();
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 409) {
          toast.error('Friend request already exists and is pending', {
            id: toastId,
          });
          return;
        }
        if (apiError.status === 404) {
          toast.error('User not found', {
            id: toastId,
          });
          return;
        }
        if (apiError.status === 400) {
          toast.error('Cannot send friend request to yourself', {
            id: toastId,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to send friend request', { id: toastId });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {isDisabled && (
        <div className="text-sm text-muted-foreground">{statusText}</div>
      )}
      <div className="flex items-center justify-between rounded-md border bg-muted/60 p-3 w-full">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
            <AvatarFallback>{(user.name || user.email)?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{user.name || 'Unnamed user'}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleAddFriend}
          disabled={isDisabled || inviteMutation?.isPending}
        >
          <UserPlus />
          <span className="hidden md:block">Add</span>
        </Button>
      </div>
    </div>

  );
}

export default AddFriendPanel;
