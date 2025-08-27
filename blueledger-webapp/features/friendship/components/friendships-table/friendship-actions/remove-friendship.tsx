import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { UserMinus } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useFriendships } from '@/features/friendship/hooks';

interface RemoveFriendshipProps {
  friendship: FriendshipDisplay;
  isCompact: boolean;
  disabled: boolean;
}

function RemoveFriendship({ friendship, isCompact, disabled }: RemoveFriendshipProps) {
  const { removeMutation } = useFriendships();

  const handleRemove = async () => {
    try {
      posthog.capture(AnalyticsEvents.FRIENDSHIP_INVITE_REMOVED_CLICKED, {
        id: friendship.id,
      });

      toast.loading('Removing friendship...', {
        id: friendship.id,
      });

      await removeMutation.mutateAsync(friendship);

      toast.success('Friendship removed successfully', {
        id: friendship.id,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 400 || apiError.status === 403) {
          toast.error('Friendship no longer exists', {
            id: friendship.id,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to remove friendship', {
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
                <UserMinus />
              </Button>
            )
          : (
              <Button
                className="w-25 border-destructive text-destructive/90 hover:bg-destructive/10 focus-visible:ring-destructive/40 cursor-pointer"
                variant="outline"
                disabled={disabled}
                size="sm"
              >
                <span>Remove</span>
              </Button>
            )}
      </DialogTrigger>
      <ConfirmationDialog
        title="Unfriend?"
        onConfirm={handleRemove}
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}

export default RemoveFriendship;
