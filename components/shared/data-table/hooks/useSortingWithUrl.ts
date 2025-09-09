import type { SortingState } from '@tanstack/react-table';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useMemo } from 'react';
import { AnalyticsEvents } from '@/constants/analytics-events';

// Using the native browser history API here to update query params without triggering a server-side navigation or data refetch.
// Since the entire data set is fetched on the client, this avoids unnecessary refetches.
// If server-side sorting/pagination/filtering is added later, switching back to Next.js router methods (e.g., router.replace) would be recommended.
export function useSortingWithUrl(
  defaultSortKey?: string,
  defaultOrder?: 'asc' | 'desc',
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') || defaultSortKey;
  const order = searchParams.get('order') || defaultOrder;

  const sorting: SortingState = useMemo(() => {
    return sort ? [{ id: sort, desc: order === 'desc' }] : [];
  }, [sort, order]);

  const setSorting = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    const currentSorting: SortingState = sort
      ? [{ id: sort, desc: order === 'desc' }]
      : [];

    const next
      = typeof updater === 'function' ? updater(currentSorting) : updater;

    if (next.length > 0) {
      const { id, desc } = next[0]!;
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', id);
      params.set('order', desc ? 'desc' : 'asc');
      posthog.capture(AnalyticsEvents.TABLE_SORT_CHANGED, { column: id, order: desc ? 'desc' : 'asc' });

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    }
    else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('sort');
      params.delete('order');
      posthog.capture(AnalyticsEvents.TABLE_SORT_CLEARED);

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    }
  };

  return [sorting, setSorting] as const;
}
