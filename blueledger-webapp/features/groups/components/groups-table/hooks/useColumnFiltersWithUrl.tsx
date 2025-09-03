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

    // Query (search text for groups)
    const name = searchParams.get('name');
    if (name) {
      filters.push({
        id: 'name',
        value: name,
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

      const filterKeys = new Set(['name']);

      // Clear all known filter params
      filterKeys.forEach(key => params.delete(key));

      for (const filter of currentFilters) {
        if (filter.id === 'name') {
          params.set('name', filter.value as string);
          capture('name');
        }
      }

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    },
    [filters, pathname, searchParams, capture],
  );

  return [filters, setFilters] as const;
}
