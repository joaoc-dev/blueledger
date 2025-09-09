import { X } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupMemberships } from '../../../hooks/useGroupMemberships';

interface CancelInviteButtonProps {
  groupId: string;
  membershipId: string;
  memberEmail: string;
  isOperationInProgress: boolean;
  setIsOperationInProgress: (inProgress: boolean) => void;
}

function CancelInvite({ groupId, membershipId, memberEmail, isOperationInProgress, setIsOperationInProgress }: CancelInviteButtonProps) {
  const { cancelInviteMutation } = useGroupMemberships();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCancelInvite = async () => {
    if (!membershipId)
      return;

    try {
      setIsOperationInProgress(true);
      posthog.capture(AnalyticsEvents.GROUP_INVITE_CANCEL_CLICKED, {
        groupId,
        membershipId,
        memberEmail,
        action: 'cancel_invite',
      });

      toast.loading('Cancelling invite...', {
        id: membershipId,
      });

      await cancelInviteMutation.mutateAsync({
        groupId,
        membershipId,
        memberEmail,
      });

      toast.success('Invite cancelled', {
        id: membershipId,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Invite no longer exists', {
            id: membershipId,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to cancel invite', {
        id: membershipId,
      });
    }
    finally {
      setIsOperationInProgress(false);
      setDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Button
        className="cursor-pointer border-1"
        variant="ghost"
        size="sm"
        disabled={isOperationInProgress}
        onClick={() => setDialogOpen(true)}
      >
        <X />
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-xs">
          <DialogHeader className="mb-4">
            <DialogTitle>Cancel invite?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button className="flex-1" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button className="flex-1" variant="destructive" onClick={handleCancelInvite}>
                Continue
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CancelInvite;
