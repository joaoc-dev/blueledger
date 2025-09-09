import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { SquarePen } from 'lucide-react';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import { AnalyticsEvents } from '@/constants/analytics-events';
import { cn } from '@/lib/utils';

interface EditGroupProps {
  currentUserMembership: GroupMembershipDisplay;
  className?: string;
  onClick?: () => void;
}

function EditGroup({ currentUserMembership, className, onClick }: EditGroupProps) {
  const handleEdit = () => {
    posthog.capture(AnalyticsEvents.GROUP_EDIT_CLICKED, {
      groupId: currentUserMembership.group.id,
      groupName: currentUserMembership.group.name,
    });
    onClick?.();
  };

  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start', className)}
      onClick={(e) => {
        e.stopPropagation();
        handleEdit();
      }}
    >
      <SquarePen />
      <span className="ml-2">Edit Group</span>
    </Button>
  );
}

export default EditGroup;
