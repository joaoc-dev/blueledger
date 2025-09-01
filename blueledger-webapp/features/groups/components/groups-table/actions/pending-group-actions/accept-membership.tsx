import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { Check } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupMemberships } from '@/features/groups/hooks/useGroupMemberships';

interface AcceptMembershipProps {
  groupMembership: GroupMembershipDisplay;
  disabled: boolean;
}

function AcceptMembership({ groupMembership, disabled }: AcceptMembershipProps) {
  const { acceptMutation } = useGroupMemberships();

  const handleAccept = async () => {
    try {
      posthog.capture(AnalyticsEvents.GROUP_INVITE_ACCEPT_CLICKED, {
        id: groupMembership.id,
      });

      toast.loading('Accepting membership...', {
        id: groupMembership.id,
      });

      await acceptMutation.mutateAsync(groupMembership);

      toast.success('Membership accepted', {
        id: groupMembership.id,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Membership invite no longer exists', {
            id: groupMembership.id,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to accept membership', {
        id: groupMembership.id,
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
          <Check />
        </Button>
      </DialogTrigger>
      <ConfirmationDialog
        title="Accept group invite?"
        onConfirm={handleAccept}
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
      />
    </Dialog>
  );
}

export default AcceptMembership;
