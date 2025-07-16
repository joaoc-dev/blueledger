import {
  LucideIcon,
  Utensils,
  Film,
  ShoppingBag,
  Plane,
  Wallet,
  CircleEllipsis,
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
  Food: Utensils,
  Entertainment: Film,
  Shopping: ShoppingBag,
  Travel: Plane,
  'Bills & Utilities': Wallet,
  Other: CircleEllipsis,
};
