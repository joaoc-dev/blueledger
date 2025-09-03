'use client';

import type { ColumnFiltersState } from '@tanstack/react-table';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useCallback, useMemo } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { AnalyticsEvents } from '@/constants/analytics-events';

export function useColumnFiltersWithUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const capture = useDebounceCallback(
    (id: string) =>
      posthog.capture(AnalyticsEvents.TABLE_FILTER_CHANGED, { id }),
    400,
  );

  const filters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = [];

    // Query (search text for friendships)
    const query = searchParams.get('query');
    if (query) {
      filters.push({
        id: 'query',
        value: query,
      });
    }

    return filters;
  }, [searchParams]);

  const setFilters = useCallback(
    (
      updater:
        | ColumnFiltersState
        | ((prev: ColumnFiltersState) => ColumnFiltersState),
    ) => {
      const currentFilters
        = typeof updater === 'function' ? updater(filters) : updater;
      const params = new URLSearchParams(searchParams.toString());

      const filterKeys = new Set(['query']);

      // Clear all known filter params
      filterKeys.forEach(key => params.delete(key));

      for (const filter of currentFilters) {
        if (filter.id === 'query') {
          params.set('query', filter.value as string);
          capture('query');
        }
      }

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    },
    [filters, pathname, searchParams, capture],
  );

  return [filters, setFilters] as const;
}
