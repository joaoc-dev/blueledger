import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddMemberProps {
  className?: string;
  onClick?: () => void;
}

function AddMember({
  className,
  onClick,
}: AddMemberProps) {
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start', className)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <UserPlus />
      <span className="ml-2">Add Member</span>
    </Button>
  );
}

export default AddMember;
