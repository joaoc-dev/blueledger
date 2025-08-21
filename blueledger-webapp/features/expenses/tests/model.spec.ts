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

  it('should validate a correct document', () => {
    const doc = new Expense(validData());
    expect(doc.validate()).resolves.toBeUndefined();
  });

  it('should require description', () => {
    const doc = new Expense({ ...validData(), description: '' });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should fail if description is too long', () => {
    const doc = new Expense({ ...validData(), description: 'a'.repeat(201) });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require price', () => {
    const doc = new Expense({ ...validData(), price: undefined });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require positive price', () => {
    const doc = new Expense({ ...validData(), price: -1 });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require quantity', () => {
    const doc = new Expense({ ...validData(), quantity: undefined });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require positive quantity', () => {
    const doc = new Expense({ ...validData(), quantity: -1 });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require totalPrice', () => {
    const doc = new Expense({ ...validData(), totalPrice: undefined });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require a category', () => {
    const doc = new Expense({ ...validData(), category: undefined });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require a valid category', () => {
    const doc = new Expense({ ...validData(), category: 'Wrong' });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require a valid date', () => {
    const doc = new Expense({ ...validData(), date: 'bad' });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require a user', () => {
    const doc = new Expense({ ...validData(), user: undefined });
    expect(doc.validate()).rejects.toThrow();
  });

  it('should require a valid user', () => {
    const doc = new Expense({ ...validData(), user: 'bad' });
    expect(doc.validate()).rejects.toThrow();
  });
});
