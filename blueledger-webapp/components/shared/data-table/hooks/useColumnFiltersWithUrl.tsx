'use client';

import type { ColumnFiltersState } from '@tanstack/react-table';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function useColumnFiltersWithUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: ColumnFiltersState = useMemo(() => {
    const filters: ColumnFiltersState = [];

    // Description (text input)
    const description = searchParams.get('description');
    if (description) {
      filters.push({
        id: 'description',
        value: description,
      });
    }

    // Category (multi-select, comma-separated)
    const categories = searchParams.get('category');
    if (categories) {
      filters.push({
        id: 'category',
        value: categories.split(','),
      });
    }

    // Price (number range)
    const priceFrom = searchParams.get('price_from');
    const priceTo = searchParams.get('price_to');
    if (priceFrom || priceTo) {
      filters.push({
        id: 'price',
        value: [
          priceFrom ? Number(priceFrom) : 0,
          priceTo ? Number(priceTo) : Infinity,
        ],
      });
    }

    // Quantity (number range)
    const quantityFrom = searchParams.get('quantity_from');
    const quantityTo = searchParams.get('quantity_to');
    if (quantityFrom || quantityTo) {
      filters.push({
        id: 'quantity',
        value: [
          quantityFrom ? Number(quantityFrom) : 0,
          quantityTo ? Number(quantityTo) : Infinity,
        ],
      });
    }

    // Total Price (number range)
    const totalPriceFrom = searchParams.get('totalPrice_from');
    const totalPriceTo = searchParams.get('totalPrice_to');
    if (totalPriceFrom || totalPriceTo) {
      filters.push({
        id: 'totalPrice',
        value: [
          totalPriceFrom ? Number(totalPriceFrom) : 0,
          totalPriceTo ? Number(totalPriceTo) : Infinity,
        ],
      });
    }

    // Date (object with from/to)
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    if (dateFrom || dateTo) {
      filters.push({
        id: 'date',
        value: {
          ...(dateFrom ? { from: dateFrom } : {}),
          ...(dateTo ? { to: dateTo } : {}),
        },
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

      const filterKeys = new Set([
        'description',
        'category',
        'price_from',
        'price_to',
        'quantity_from',
        'quantity_to',
        'totalPrice_from',
        'totalPrice_to',
        'date_from',
        'date_to',
      ]);

      // Clear all known filter params
      filterKeys.forEach(key => params.delete(key));

      for (const filter of currentFilters) {
        if (filter.id === 'description') {
          params.set('description', filter.value as string);
        }

        if (filter.id === 'category') {
          params.set('category', (filter.value as string[]).join(','));
        }

        if (filter.id === 'price' && Array.isArray(filter.value)) {
          const [from, to] = filter.value;
          if (from != null)
            params.set('price_from', String(from));
          if (to != null)
            params.set('price_to', String(to));
        }

        if (filter.id === 'quantity' && Array.isArray(filter.value)) {
          const [from, to] = filter.value;
          if (from != null)
            params.set('quantity_from', String(from));
          if (to != null)
            params.set('quantity_to', String(to));
        }

        if (filter.id === 'totalPrice' && Array.isArray(filter.value)) {
          const [from, to] = filter.value;
          if (from != null)
            params.set('totalPrice_from', String(from));
          if (to != null)
            params.set('totalPrice_to', String(to));
        }

        if (filter.id === 'date' && typeof filter.value === 'object') {
          const { from, to } = filter.value as { from: string; to: string };
          if (from)
            params.set('date_from', new Date(from).toISOString());
          if (to)
            params.set('date_to', new Date(to).toISOString());
        }
      }

      window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
    },
    [filters, pathname, searchParams],
  );

  return [filters, setFilters] as const;
}
