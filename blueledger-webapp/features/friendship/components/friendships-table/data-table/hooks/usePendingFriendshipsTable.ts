import type { FriendshipDisplay } from '@/features/friendship/schemas';
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { usePaginationWithUrl } from '@/components/shared/data-table/hooks/usePaginationWithUrl';
import { usePersistentTableState } from '@/components/shared/data-table/hooks/usePersistentTableState';
import { useSortingWithUrl } from '@/components/shared/data-table/hooks/useSortingWithUrl';
import { PENDING_FRIENDSHIPS_TABLE_CONFIG } from '../../constants';
import { useColumnFiltersWithUrl } from '../../hooks/useColumnFiltersWithUrl';
import { pendingFriendshipsColumns } from '../columns';

interface UsePendingFriendshipsTableOptions {
  enablePagination?: boolean;
  enableSorting?: boolean;
}

export function usePendingFriendshipsTable(
  data: FriendshipDisplay[],
  options: UsePendingFriendshipsTableOptions = {},
) {
  const { enablePagination = true, enableSorting = true } = options;
  const defaultColumnOrder = pendingFriendshipsColumns.map(c => c.id!).filter(Boolean);

  const localStorageKeys = PENDING_FRIENDSHIPS_TABLE_CONFIG.LOCAL_STORAGE_KEYS;

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

  const [sorting, setSorting] = useSortingWithUrl('createdAt', 'desc');
  const [pagination, setPagination] = usePaginationWithUrl();
  const [columnFilters, setColumnFilters] = useColumnFiltersWithUrl();

  // Only initialize sorting and pagination if enabled
  const sortingState = enableSorting ? sorting : undefined;
  const paginationState = enablePagination ? pagination : undefined;

  const mergedColumnVisibility = {
    query: false, // Always force this hidden
    ...columnVisibility, // Keep persisted visibility for other columns
  };

  const pendingFriendshipsTable = useReactTable({
    data,
    columns: pendingFriendshipsColumns,
    defaultColumn: {
      minSize: 60,
    },
    initialState: {
      columnPinning: {
        right: ['filler', 'actions'],
      },
      // Set initial pagination state to prevent TanStack Table from overriding it (only if enabled)
      ...(enablePagination && { pagination }),
    },
    // Prevent automatic page resets when data changes
    autoResetPageIndex: false,
    state: {
      columnVisibility: mergedColumnVisibility,
      ...(enableSorting && { sorting: sortingState }),
      columnFilters,
      columnOrder,
      columnSizing,
      ...(enablePagination && { pagination: paginationState }),
    },
    columnResizeMode: 'onChange',
    ...(enablePagination && { onPaginationChange: setPagination }),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
    ...(enableSorting && { onSortingChange: setSorting }),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onColumnSizingChange: setColumnSizing,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return { pendingFriendshipsTable, setColumnOrder };
}
