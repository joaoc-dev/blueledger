import { CATEGORY_ICONS } from '@/features/expenses/constants';
import { Row } from '@tanstack/react-table';
import { CircleEllipsis } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ExpenseDisplay } from '../../../schemas';

export function CategoryCell({ row }: { row: Row<ExpenseDisplay> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  const Icon =
    row.original.category && row.original.category in CATEGORY_ICONS
      ? CATEGORY_ICONS[row.original.category]
      : CircleEllipsis;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsNarrow(entry.contentRect.width < 60);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-center gap-2 overflow-hidden">
      <Icon className="h-4 w-4 shrink-0" />
      {!isNarrow && (
        <span className="truncate">{row.original.category ?? 'Other'}</span>
      )}
    </div>
  );
}
