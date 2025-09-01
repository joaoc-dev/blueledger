import { Crown } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupMemberships } from '../../../hooks/useGroupMemberships';

interface TransferOwnershipProps {
  groupId: string;
  membershipId: string;
  memberName: string;
  onSuccess?: () => void;
}

function TransferOwnership({ groupId, membershipId, memberName, onSuccess }: TransferOwnershipProps) {
  const { transferOwnershipMutation } = useGroupMemberships();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTransfer = async () => {
    if (!membershipId)
      return;

    try {
      posthog.capture(AnalyticsEvents.GROUP_MEMBERSHIP_TRANSFER_OWNERSHIP_CLICKED, {
        groupId,
        membershipId,
        memberName,
        action: 'transfer_ownership',
      });

      toast.loading('Transferring ownership...', {
        id: membershipId,
      });

      await transferOwnershipMutation.mutateAsync({
        groupId,
        membershipId,
        memberName,
      });

      toast.success('Ownership transferred successfully', {
        id: membershipId,
      });

      onSuccess?.();
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
      toast.error('Failed to transfer ownership', {
        id: membershipId,
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer border-1"
          variant="ghost"
          size="sm"
        >
          <Crown className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <ConfirmationDialog
        title="Transfer ownership?"
        onConfirm={handleTransfer}
        confirmButtonText="Transfer"
        cancelButtonText="Cancel"
        variant="default"
      />
    </Dialog>
  );
}

export default TransferOwnership;
