import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewMembersProps {
  className?: string;
  onClick?: () => void;
}

function ViewMembers({
  className,
  onClick,
}: ViewMembersProps) {
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start', className)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Users />
      <span className="ml-2">View Members</span>
    </Button>
  );
}

export default ViewMembers;
