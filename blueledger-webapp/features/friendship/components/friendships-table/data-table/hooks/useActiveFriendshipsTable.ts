import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { usePaginationWithUrl } from '@/components/shared/data-table/hooks/usePaginationWithUrl';
import { usePersistentTableState } from '@/components/shared/data-table/hooks/usePersistentTableState';
import { useSortingWithUrl } from '@/components/shared/data-table/hooks/useSortingWithUrl';
import { ACTIVE_FRIENDSHIPS_TABLE_CONFIG } from '../../constants';
import { useColumnFiltersWithUrl } from '../../hooks/useColumnFiltersWithUrl';
import { activeFriendshipsColumns } from '../columns';

export function useActiveFriendshipsTable(data: FriendshipDisplay[]) {
  const defaultColumnOrder = activeFriendshipsColumns.map(c => c.id!).filter(Boolean);

  const localStorageKeys = ACTIVE_FRIENDSHIPS_TABLE_CONFIG.LOCAL_STORAGE_KEYS;

  const {
    state: { columnVisibility, columnOrder, columnSizing },
    handlers: { setColumnVisibility, setColumnOrder, setColumnSizing },
  } = usePersistentTableState({
    keys: {
      COLUMN_ORDER: localStorageKeys.COLUMN_ORDER,
      COLUMN_VISIBILITY: localStorageKeys.COLUMN_VISIBILITY,
      COLUMN_SIZES: localStorageKeys.COLUMN_SIZES,
    },
    defaultColumnOrder,
  });

  const [sorting, setSorting] = useSortingWithUrl('acceptedAt', 'desc');
  const [pagination, setPagination] = usePaginationWithUrl();
  const [columnFilters, setColumnFilters] = useColumnFiltersWithUrl();

  const mergedColumnVisibility = {
    query: false, // Always force this hidden
    ...columnVisibility, // Keep persisted visibility for other columns
  };

  const activeFriendshipsTable = useReactTable({
    data,
    columns: activeFriendshipsColumns,
    defaultColumn: {
      minSize: 60,
    },
    initialState: {
      columnPinning: {
        right: ['filler', 'actions'],
      },
      // Set initial pagination state to prevent TanStack Table from overriding it
      pagination,
    },
    // Prevent automatic page resets when data changes
    autoResetPageIndex: false,
    state: {
      columnVisibility: mergedColumnVisibility,
      sorting,
      columnFilters,
      columnOrder,
      columnSizing,
      pagination,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onColumnSizingChange: setColumnSizing,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return { activeFriendshipsTable, setColumnOrder };
}
