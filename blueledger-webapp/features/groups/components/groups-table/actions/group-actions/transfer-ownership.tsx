import { Crown } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TransferOwnershipProps {
  className?: string;
  onClick?: () => void;
}

function TransferOwnership({
  className,
  onClick,
}: TransferOwnershipProps) {
  return (
    <Button
      variant="ghost"
      className={cn('w-full justify-start', className)}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Crown />
      <span className="ml-2">Transfer ownership</span>
    </Button>
  );
}

export default TransferOwnership;
