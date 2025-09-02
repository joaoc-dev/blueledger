import { Trash } from 'lucide-react';
import { Button } from '@/components/ui-modified/button';
import { cn } from '@/lib/utils';

interface DeleteGroupProps {
  className?: string;
  onClick?: () => void;
}

function DeleteGroup({
  className,
  onClick,
}: DeleteGroupProps) {
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start', className)}
      onClick={onClick}
    >
      <Trash />
      <span className="ml-2">Delete Group</span>
    </Button>
  );
}

export default DeleteGroup;
