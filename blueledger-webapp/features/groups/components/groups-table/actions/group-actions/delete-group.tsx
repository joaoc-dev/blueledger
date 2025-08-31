import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { Trash } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui-modified/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroups } from '@/features/groups/hooks/useGroups';
import { cn } from '@/lib/utils';

interface DeleteGroupProps {
  groupMembership: GroupMembershipDisplay;
  className?: string;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

function DeleteGroup({ groupMembership, className, onModalOpen, onModalClose }: DeleteGroupProps) {
  const { deleteGroupMutation } = useGroups();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      posthog.capture(AnalyticsEvents.GROUP_DELETE_CLICKED, {
        id: groupMembership.group.id,
      });

      toast.loading('Deleting group...', {
        id: groupMembership.group.id,
      });

      await deleteGroupMutation.mutateAsync(groupMembership.group.id!);

      toast.success('Group deleted successfully', {
        id: groupMembership.group.id,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Group no longer exists', {
            id: groupMembership.group.id,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to delete group', {
        id: groupMembership.group.id,
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      setDialogOpen(open);
      if (open) {
        onModalOpen?.();
      } else {
        onModalClose?.();
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="ghost" className={cn('w-full justify-start', className)}>
          <Trash />
          <span className="ml-2">Delete Group</span>
        </Button>
      </DialogTrigger>
      <ConfirmationDialog
        title="Delete group?"
        onConfirm={handleDelete}
        confirmButtonText="Continue"
        cancelButtonText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}

export default DeleteGroup;
