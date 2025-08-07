import type { OnChangeFn } from '@tanstack/react-table';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TableStateKeys {
  COLUMN_ORDER: string;
  COLUMN_SIZES: string;
  COLUMN_VISIBILITY: string;
}

export function usePersistentTableState({
  keys,
  defaultColumnOrder,
}: {
  keys: TableStateKeys;
  defaultColumnOrder: string[];
}) {
  const [columnVisibility, setColumnVisibility] = useLocalStorage<
    Record<string, boolean>
  >(keys.COLUMN_VISIBILITY, {});

  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
    keys.COLUMN_ORDER,
    defaultColumnOrder,
  );

  const { columnSizing, handleColumnSizingChange } = useColumnSizing(keys);

  return {
    state: {
      columnVisibility,
      columnOrder,
      columnSizing,
    },
    handlers: {
      setColumnVisibility,
      setColumnOrder,
      setColumnSizing: handleColumnSizingChange,
    },
  };
}

function useColumnSizing(keys: TableStateKeys) {
  // Keep localStorage synced sizing, but keep UI updates separate
  const [columnSizingLocalStorage, setColumnSizingLocalStorage]
    = useLocalStorage<Record<string, number>>(keys.COLUMN_SIZES, {});

  // Local state for immediate UI updates
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>(
    columnSizingLocalStorage,
  );

  // Debounce localStorage update
  const saveSizingDebounced = useMemo(() => {
    return debounce((nextSizing: Record<string, number>) => {
      setColumnSizingLocalStorage(nextSizing);
    }, 500);
  }, [setColumnSizingLocalStorage]);

  // Handler called by table on sizing change
  const handleColumnSizingChange: OnChangeFn<Record<string, number>> = (
    updater,
  ) => {
    // Calculate next sizing value
    const nextSizing
      = typeof updater === 'function' ? updater(columnSizing) : updater;

    // Immediate UI update
    setColumnSizing(nextSizing);

    // // Debounced localStorage update
    saveSizingDebounced(nextSizing);
  };

  // Cancel debounce on unmount
  useEffect(() => {
    return () => saveSizingDebounced.cancel();
  }, [saveSizingDebounced]);

  return {
    columnSizing,
    handleColumnSizingChange,
  };
}
