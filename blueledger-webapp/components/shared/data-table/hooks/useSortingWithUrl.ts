import { SortingState } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

// Using the native browser history API here to update query params without triggering a server-side navigation or data refetch.
// Since the entire data set is fetched on the client, this avoids unnecessary refetches.
// If server-side sorting/pagination/filtering is added later, switching back to Next.js router methods (e.g., router.replace) would be recommended.
export function useSortingWithUrl(
  defaultSortKey?: string,
  defaultOrder?: 'asc' | 'desc'
) {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || defaultSortKey;
  const order = searchParams.get('order') || defaultOrder;

  const sorting: SortingState = useMemo(() => {
    return sort ? [{ id: sort, desc: order === 'desc' }] : [];
  }, [sort, order]);

  const setSorting = (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const currentSorting: SortingState = sort
      ? [{ id: sort, desc: order === 'desc' }]
      : [];

    const next =
      typeof updater === 'function' ? updater(currentSorting) : updater;

    if (next.length > 0) {
      const { id, desc } = next[0];
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', id);
      params.set('order', desc ? 'desc' : 'asc');

      window.history.replaceState(null, '', `?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('sort');
      params.delete('order');

      window.history.replaceState(null, '', `?${params.toString()}`);
    }
  };

  return [sorting, setSorting] as const;
}
