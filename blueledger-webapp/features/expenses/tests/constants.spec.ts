import { describe, expect, it } from 'vitest';
import {
  CATEGORY_ICONS,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORIES_VALUES,
} from '../constants';

describe('expenses/constants', () => {
  it('should contain all expected category values', () => {
    const values = EXPENSE_CATEGORIES_VALUES;
    expect(values).toContain(EXPENSE_CATEGORIES.OTHER);
    expect(values).toContain(EXPENSE_CATEGORIES.FOOD);
    expect(values).toContain(EXPENSE_CATEGORIES.ENTERTAINMENT);
    expect(values).toContain(EXPENSE_CATEGORIES.SHOPPING);
    expect(values).toContain(EXPENSE_CATEGORIES.TRAVEL);
    expect(values).toContain(EXPENSE_CATEGORIES.BILLS_AND_UTILITIES);
  });

  it('should have unique category values with no duplicates', () => {
    const values = EXPENSE_CATEGORIES_VALUES;
    const set = new Set(values);
    expect(set.size).toBe(values.length);
  });

  it('should have an icon for every category', () => {
    for (const category of EXPENSE_CATEGORIES_VALUES) {
      expect(CATEGORY_ICONS[category]).toBeTruthy();
    }
  });
});
