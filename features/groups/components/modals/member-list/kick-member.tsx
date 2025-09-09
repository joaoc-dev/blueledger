import { UserMinus } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupMemberships } from '../../../hooks/useGroupMemberships';

interface KickMemberProps {
  groupId: string;
  membershipId: string;
  memberName: string;
  isOperationInProgress: boolean;
  setIsOperationInProgress: (inProgress: boolean) => void;
}

function KickMember({ groupId, membershipId, memberName, isOperationInProgress, setIsOperationInProgress }: KickMemberProps) {
  const { kickMemberMutation } = useGroupMemberships();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleKick = async () => {
    if (!membershipId)
      return;

    try {
      setIsOperationInProgress(true);
      posthog.capture(AnalyticsEvents.GROUP_MEMBERSHIP_KICK_CLICKED, {
        groupId,
        membershipId,
        memberName,
        action: 'kick_member',
      });

      toast.loading('Removing member...', {
        id: membershipId,
      });

      await kickMemberMutation.mutateAsync({
        groupId,
        membershipId,
        memberName,
      });

      toast.success('Member removed', {
        id: membershipId,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Member no longer exists', {
            id: membershipId,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to remove member', {
        id: membershipId,
      });
    }
    finally {
      setIsOperationInProgress(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer border-1"
          variant="ghost"
          size="sm"
          disabled={isOperationInProgress}
        >
          <UserMinus />
        </Button>
      </DialogTrigger>
      <ConfirmationDialog
        title={`Remove ${memberName}?`}
        onConfirm={handleKick}
        confirmButtonText="Remove"
        cancelButtonText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}

export default KickMember;
