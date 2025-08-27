import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { XCircle } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useFriendships } from '@/features/friendship/hooks';

interface CancelFriendshipProps {
  friendship: FriendshipDisplay;
  isCompact: boolean;
  disabled: boolean;
}

function CancelFriendship({ friendship, isCompact, disabled }: CancelFriendshipProps) {
  const { cancelMutation } = useFriendships();

  const handleCancel = async () => {
    try {
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_CANCELLED_CLICKED, {
        id: friendship.id,
      });

      toast.loading('Cancelling friend request...', {
        id: friendship.id,
      });

      await cancelMutation.mutateAsync(friendship);

      toast.success('Friend request cancelled successfully', {
        id: friendship.id,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Friendship invite no longer exists', {
            id: friendship.id,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to cancel friend request', {
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
                <XCircle />
              </Button>
            )
          : (
              <Button
                className="w-25 border-destructive text-destructive/90 hover:bg-destructive/10 focus-visible:ring-destructive/40 cursor-pointer"
                variant="outline"
                disabled={disabled}
                size="sm"
              >
                <span>Cancel</span>
              </Button>
            )}
      </DialogTrigger>
      <ConfirmationDialog
        title="Cancel friend request?"
        onConfirm={handleCancel}
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}

export default CancelFriendship;
