import type {
  LucideIcon,
} from 'lucide-react';
import {
  CircleEllipsis,
  Film,
  Plane,
  ShoppingBag,
  Utensils,
  Wallet,
} from 'lucide-react';

export const EXPENSE_CATEGORIES = {
  OTHER: 'Other',
  FOOD: 'Food',
  ENTERTAINMENT: 'Entertainment',
  SHOPPING: 'Shopping',
  TRAVEL: 'Travel',
  BILLS_AND_UTILITIES: 'Bills & Utilities',
} as const;

export const EXPENSE_CATEGORIES_VALUES = [
  EXPENSE_CATEGORIES.OTHER,
  EXPENSE_CATEGORIES.FOOD,
  EXPENSE_CATEGORIES.ENTERTAINMENT,
  EXPENSE_CATEGORIES.SHOPPING,
  EXPENSE_CATEGORIES.TRAVEL,
  EXPENSE_CATEGORIES.BILLS_AND_UTILITIES,
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES_VALUES)[number];

export const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  'Food': Utensils,
  'Entertainment': Film,
  'Shopping': ShoppingBag,
  'Travel': Plane,
  'Bills & Utilities': Wallet,
  'Other': CircleEllipsis,
};

// Color palette for consistent category visualization across charts
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  'Food': 'var(--category-food)',
  'Entertainment': 'var(--category-entertainment)',
  'Shopping': 'var(--category-shopping)',
  'Travel': 'var(--category-travel)',
  'Bills & Utilities': 'var(--category-bills)',
  'Other': 'var(--category-other)',
};

/**
 * Generates a chart configuration object for category-based charts
 * Maps category names to their colors and proper labels
 */
export function generateCategoryChartConfig() {
  return EXPENSE_CATEGORIES_VALUES.reduce((config, category) => {
    config[category] = {
      label: category,
      color: CATEGORY_COLORS[category],
    };

    return config;
  }, {} as Record<string, { label: string; color: string }>);
}
