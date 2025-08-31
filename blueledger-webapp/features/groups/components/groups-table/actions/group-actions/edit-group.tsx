import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { SquarePen } from 'lucide-react';
import posthog from 'posthog-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import GroupModal from '@/features/groups/components/modals/group-modal';
import { cn } from '@/lib/utils';

interface EditGroupProps {
  groupMembership: GroupMembershipDisplay;
  className?: string;
  onModalOpen?: () => void;
  onModalClose?: () => void;
}

function EditGroup({ groupMembership, className, onModalOpen, onModalClose }: EditGroupProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    posthog.capture(AnalyticsEvents.GROUP_EDIT_CLICKED, {
      groupId: groupMembership.group.id,
      groupName: groupMembership.group.name,
    });
    onModalOpen?.();
    setIsModalOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        className={cn('w-full justify-start', className)}
        onClick={handleEdit}
      >
        <SquarePen />
        <span className="ml-2">Edit Group</span>
      </Button>

      <GroupModal
        isOpen={isModalOpen}
        setIsOpen={(open) => {
          if (!open)
            onModalClose?.();
          setIsModalOpen(open);
        }}
        group={groupMembership}
      />
    </>
  );
}

export default EditGroup;
