import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface ColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

// We wrap the component because drag overlay uses header.toString() to display the header text
export function columnHeader<TData, TValue>(title: string) {
  const fn = ({ column }: { column: Column<TData, TValue> }) => (
    <ColumnHeaderComponent column={column} title={title} />
  );
  fn.toString = () => title;
  return fn;
}

const ColumnHeaderComponent = <TData, TValue>({
  column,
  title,
  className,
}: ColumnHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start data-[state=open]:bg-accent -ml-3 h-8 cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : null}
      </Button>
    </div>
  );
};
