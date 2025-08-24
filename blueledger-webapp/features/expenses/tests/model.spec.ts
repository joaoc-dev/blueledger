import mongoose from 'mongoose';
import { describe, expect, it } from 'vitest';
import { EXPENSE_CATEGORIES } from '../constants';
import Expense from '../model';

describe('expense model validation', () => {
  const validData = () => ({
    description: 'Item',
    price: 1,
    quantity: 1,
    totalPrice: 1,
    category: EXPENSE_CATEGORIES.FOOD,
    date: new Date(),
    user: new mongoose.Types.ObjectId(),
  });

  it('should validate a correct document', async () => {
    const doc = new Expense(validData());
    await expect(doc.validate()).resolves.toBeUndefined();
  });

  it('should require description', async () => {
    const doc = new Expense({ ...validData(), description: '' });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should fail if description is too long', async () => {
    const doc = new Expense({ ...validData(), description: 'a'.repeat(201) });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require price', async () => {
    const doc = new Expense({ ...validData(), price: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require positive price', async () => {
    const doc = new Expense({ ...validData(), price: -1 });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require quantity', async () => {
    const doc = new Expense({ ...validData(), quantity: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require positive quantity', async () => {
    const doc = new Expense({ ...validData(), quantity: -1 });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require totalPrice', async () => {
    const doc = new Expense({ ...validData(), totalPrice: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require a category', async () => {
    const doc = new Expense({ ...validData(), category: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require a valid category', async () => {
    const doc = new Expense({ ...validData(), category: 'Wrong' });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require a valid date', async () => {
    const doc = new Expense({ ...validData(), date: 'bad' });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require a user', async () => {
    const doc = new Expense({ ...validData(), user: undefined });
    await expect(doc.validate()).rejects.toThrow();
  });

  it('should require a valid user', async () => {
    const doc = new Expense({ ...validData(), user: 'bad' });
    await expect(doc.validate()).rejects.toThrow();
  });
});
