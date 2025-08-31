export const ACTIVE_GROUPS_TABLE_CONFIG = {
  LOCAL_STORAGE_KEYS: {
    COLUMN_ORDER: 'active_groups.columnOrder',
    COLUMN_SIZES: 'active_groups.columnSizes',
    COLUMN_VISIBILITY: 'active_groups.columnVisibility',
  },
} as const;

export const PENDING_GROUPS_TABLE_CONFIG = {
  LOCAL_STORAGE_KEYS: {
    COLUMN_ORDER: 'pending_groups.columnOrder',
    COLUMN_SIZES: 'pending_groups.columnSizes',
    COLUMN_VISIBILITY: 'pending_groups.columnVisibility',
  },
} as const;
