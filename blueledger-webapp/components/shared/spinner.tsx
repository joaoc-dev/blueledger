import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return <Loader2 className={cn('animate-spin', className)} />;
};

export default Spinner;
