export const ACTIVE_FRIENDSHIPS_TABLE_CONFIG = {
  LOCAL_STORAGE_KEYS: {
    COLUMN_ORDER: 'active_friendships.columnOrder',
    COLUMN_SIZES: 'active_friendships.columnSizes',
    COLUMN_VISIBILITY: 'active_friendships.columnVisibility',
    SORTING: 'active_friendships.sorting',
    COLUMN_FILTERS: 'active_friendships.columnFilters',
  },
} as const;

export const PENDING_FRIENDSHIPS_TABLE_CONFIG = {
  LOCAL_STORAGE_KEYS: {
    COLUMN_ORDER: 'pending_friendships.columnOrder',
    COLUMN_SIZES: 'pending_friendships.columnSizes',
    COLUMN_VISIBILITY: 'pending_friendships.columnVisibility',
    SORTING: 'pending_friendships.sorting',
    COLUMN_FILTERS: 'pending_friendships.columnFilters',
  },
} as const;
