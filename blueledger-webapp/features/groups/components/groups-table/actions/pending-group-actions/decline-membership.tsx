import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { XCircle } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupMemberships } from '@/features/groups/hooks/useGroupMemberships';

interface DeclineMembershipProps {
  currentUserMembership: GroupMembershipDisplay;
  disabled: boolean;
}

function DeclineMembership({ currentUserMembership, disabled }: DeclineMembershipProps) {
  const { declineMutation } = useGroupMemberships();

  const handleReject = async () => {
    try {
      posthog.capture(AnalyticsEvents.GROUP_INVITE_DECLINE_CLICKED, {
        id: currentUserMembership.id,
      });

      toast.loading('Declining group invite...', {
        id: currentUserMembership.id,
      });

      await declineMutation.mutateAsync(currentUserMembership);

      toast.success('Group invite declined', {
        id: currentUserMembership.id,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Group invite no longer exists', {
            id: currentUserMembership.id,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to decline group invite', {
        id: currentUserMembership.id,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>

        <Button
          className="cursor-pointer border-1"
          variant="ghost"
          disabled={disabled}
        >
          <XCircle />
        </Button>

      </DialogTrigger>
      <ConfirmationDialog
        title="Decline group invite?"
        onConfirm={handleReject}
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}

export default DeclineMembership;
