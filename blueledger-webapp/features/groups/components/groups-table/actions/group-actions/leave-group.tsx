import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { DoorOpen } from 'lucide-react';
import posthog from 'posthog-js';
import { toast } from 'sonner';
import ConfirmationDialog from '@/components/shared/confirmation-dialog';
import { Button } from '@/components/ui-modified/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupMemberships } from '@/features/groups/hooks/useGroupMemberships';
import { cn } from '@/lib/utils';

interface LeaveGroupProps {
  currentUserMembership: GroupMembershipDisplay;
  className?: string;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

function LeaveGroup({
  currentUserMembership,
  className,
  onModalOpen,
  onModalClose,
}: LeaveGroupProps) {
  const { leaveGroupMutation } = useGroupMemberships();

  const handleLeave = async () => {
    try {
      posthog.capture(AnalyticsEvents.GROUP_LEAVE_CLICKED, {
        groupId: currentUserMembership.group.id,
        groupName: currentUserMembership.group.name,
      });

      onModalOpen?.();

      toast.loading('Leaving group...', {
        id: currentUserMembership.id,
      });

      await leaveGroupMutation.mutateAsync(currentUserMembership);

      toast.success('Successfully left the group', {
        id: currentUserMembership.id,
      });
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Membership invite no longer exists', {
            id: currentUserMembership.id,
          });
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to leave group', {
        id: currentUserMembership.id,
      });
    }
    finally {
      onModalClose?.();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn('w-full justify-start', className)}
        >
          <DoorOpen />
          <span className="ml-2">Leave Group</span>
        </Button>
      </DialogTrigger>
      <ConfirmationDialog
        title="Leave group?"
        onConfirm={handleLeave}
        confirmButtonText="Confirm"
        cancelButtonText="Cancel"
        variant="destructive"
      />
    </Dialog>
  );
}

export default LeaveGroup;
