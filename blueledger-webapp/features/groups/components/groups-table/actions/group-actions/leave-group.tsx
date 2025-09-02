import { DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui-modified/button';
import { cn } from '@/lib/utils';

interface LeaveGroupProps {
  className?: string;
  onClick?: () => void;
}

function LeaveGroup({
  className,
  onClick,
}: LeaveGroupProps) {
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start', className)}
      onClick={onClick}
    >
      <DoorOpen />
      <span className="ml-2">Leave Group</span>
    </Button>
  );
}

export default LeaveGroup;
