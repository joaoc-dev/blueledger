'use client';

import type { PaginationState } from '@tanstack/react-table';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useMemo } from 'react';
import { AnalyticsEvents } from '@/constants/analytics-events';

export function usePaginationWithUrl(defaults = { pageSize: 10 }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse the current page from URL (e.g., "page=2" becomes pageIndex: 1)
  // Default to page 1 if no page parameter exists
  const initialPageIndex = Number.parseInt(searchParams.get('page') || '1', 10) - 1;

  // Create the pagination state that TanStack Table will use
  const pagination: PaginationState = useMemo(() => {
    return {
      pageIndex: Number.isNaN(initialPageIndex) ? 0 : initialPageIndex,
      pageSize: defaults.pageSize,
    };
  }, [initialPageIndex, defaults.pageSize]);

  // Handle pagination changes and update URL
  const setPagination = (
    updater: PaginationState | ((old: PaginationState) => PaginationState),
  ) => {
    // Get current pagination state
    const currentPagination: PaginationState = {
      pageIndex: Number.parseInt(searchParams.get('page') || '1', 10) - 1,
      pageSize: defaults.pageSize,
    };

    // Execute the updater to get the new pagination state
    const next
      = typeof updater === 'function' ? updater(currentPagination) : updater;

    // Update URL if page index is changing
    if (next.pageIndex !== currentPagination.pageIndex) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', (next.pageIndex + 1).toString());

      posthog.capture(AnalyticsEvents.TABLE_PAGE_CHANGED, { page: next.pageIndex + 1 });

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    }
  };

  return [pagination, setPagination] as const;
}
