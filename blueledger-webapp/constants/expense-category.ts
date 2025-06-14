import {
  LucideIcon,
  Utensils,
  Film,
  ShoppingBag,
  Plane,
  Wallet,
  CircleEllipsis,
} from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  'Other',
  'Food',
  'Entertainment',
  'Shopping',
  'Travel',
  'Bills & Utilities',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const CATEGORY_ICONS: Record<ExpenseCategory, LucideIcon> = {
  Food: Utensils,
  Entertainment: Film,
  Shopping: ShoppingBag,
  Travel: Plane,
  'Bills & Utilities': Wallet,
  Other: CircleEllipsis,
};
