import type { GroupMembershipDisplay } from '@/features/groups/schemas';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GROUP_ROLES } from '@/features/groups/constants';
import { cn } from '@/lib/utils';

interface ManageMembersProps {
  currentUserMembership: GroupMembershipDisplay;
  className?: string;
  onClick?: () => void;
}

function ManageMembers({
  currentUserMembership,
  className,
  onClick,
}: ManageMembersProps) {
  const handleClick = () => {
    if (currentUserMembership.role !== GROUP_ROLES.OWNER)
      return;

    onClick?.();
  };

  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start', className)}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
    >
      <Users />
      <span className="ml-2">Manage Members</span>
    </Button>
  );
}

export default ManageMembers;
