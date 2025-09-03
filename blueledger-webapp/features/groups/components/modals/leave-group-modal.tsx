import type { GroupMembershipDisplay } from '../../schemas';
import { DoorOpen } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { toast } from 'sonner';
import Modal from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroupMemberships } from '../../hooks/useGroupMemberships';

interface LeaveGroupModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUserMembership: GroupMembershipDisplay;
}

function LeaveGroupModal({ isOpen, setIsOpen, currentUserMembership }: LeaveGroupModalProps) {
  const { leaveGroupMutation } = useGroupMemberships();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeave = async () => {
    setIsLeaving(true);

    try {
      posthog.capture(AnalyticsEvents.GROUP_LEAVE_CLICKED, {
        groupId: currentUserMembership.group.id,
        groupName: currentUserMembership.group.name,
      });

      toast.loading('Leaving group...', {
        id: currentUserMembership.id,
      });

      await leaveGroupMutation.mutateAsync(currentUserMembership);

      toast.success('Successfully left the group', {
        id: currentUserMembership.id,
      });

      setIsOpen(false);
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Membership invite no longer exists', {
            id: currentUserMembership.id,
          });
          setIsOpen(false);
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to leave group', {
        id: currentUserMembership.id,
      });
    }
    finally {
      setIsLeaving(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Leave Group"
    >
      <div className="text-sm text-muted-foreground mb-4 flex flex-col gap-3">
        <p>
          Are you sure you want to leave
          <span className="font-bold text-foreground">
            {' '}
            {currentUserMembership.group.name}
            {' '}
          </span>
          ?
        </p>
      </div>
      <div className="flex justify-between gap-3 mt-6 w-full">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isLeaving}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          variant="destructive"
          onClick={handleLeave}
          disabled={isLeaving}
        >
          <DoorOpen className="w-4 h-4 mr-2" />
          {isLeaving ? 'Leaving...' : 'Leave Group'}
        </Button>
      </div>
    </Modal>
  );
}

export default LeaveGroupModal;
