import type { GroupMembershipDisplay } from '../../schemas';
import { Trash } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { toast } from 'sonner';
import Modal from '@/components/shared/modal';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { useGroups } from '../../hooks/useGroups';

interface DeleteGroupModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentUserMembership: GroupMembershipDisplay;
}

function DeleteGroupModal({ isOpen, setIsOpen, currentUserMembership }: DeleteGroupModalProps) {
  const { deleteGroupMutation } = useGroups();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      posthog.capture(AnalyticsEvents.GROUP_DELETE_CLICKED, {
        id: currentUserMembership.group.id,
      });

      toast.loading('Deleting group...', {
        id: currentUserMembership.group.id,
      });

      await deleteGroupMutation.mutateAsync(currentUserMembership.group.id!);

      toast.success('Group deleted successfully', {
        id: currentUserMembership.group.id,
      });

      setIsOpen(false);
    }
    catch (error) {
      // Check for specific error types
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as any;
        if (apiError.status === 404 || apiError.status === 403 || apiError.status === 409) {
          toast.error('Group no longer exists', {
            id: currentUserMembership.group.id,
          });
          setIsOpen(false);
          return;
        }
      }

      // Generic error for other cases
      toast.error('Failed to delete group', {
        id: currentUserMembership.group.id,
      });
    }
    finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Delete Group"
    >
      <div className="text-sm text-muted-foreground mb-4 flex flex-col gap-3">
        <p>
          Are you sure you want to delete
          <span className="font-bold text-foreground">
            {' '}
            {currentUserMembership.group.name}
            {' '}
          </span>
          ?
        </p>
        <p> This action cannot be undone.</p>
      </div>
      <div className="flex justify-between gap-3 mt-6 w-full">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => setIsOpen(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash className="w-4 h-4 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete Group'}
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteGroupModal;
