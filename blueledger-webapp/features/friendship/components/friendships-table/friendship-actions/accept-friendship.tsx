import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { Check } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useFriendships } from '@/features/friendship/hooks';

interface AcceptFriendshipProps {
  friendship: FriendshipDisplay;
  isCompact: boolean;
  disabled: boolean;
}

function AcceptFriendship({ friendship, isCompact, disabled }: AcceptFriendshipProps) {
  const { acceptMutation } = useFriendships();

  const handleAccept = async () => {
    try {
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_ACCEPTED_CLICKED, {
        id: friendship.id,
      });

      toast.loading('Accepting friend request...', {
        id: friendship.id,
      });

      await acceptMutation.mutateAsync(friendship);

      toast.success('Friend request accepted successfully', {
        id: friendship.id,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400) {
          toast.error('Friendship invite no longer exists', {
            id: friendship.id,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to accept friend request', {
        id: friendship.id,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isCompact
          ? (
              <Button
                className="cursor-pointer border-1"
                variant="ghost"
                disabled={disabled}
              >
                <Check />
              </Button>
            )
          : (
              <Button
                className="w-25 border-green-500 text-green-500/90 hover:bg-green-500/10 focus-visible:ring-green-500/40 cursor-pointer"
                variant="outline"
                disabled={disabled}
                size="sm"
              >
                <span>Accept</span>
              </Button>
            )}
      </DialogTrigger>
      <ConfirmationDialog
        title="Accept friend request?"
        onConfirm={handleAccept}
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
      />
    </Dialog>
  );
}

export default AcceptFriendship;
