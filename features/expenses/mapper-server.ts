import type { ExpenseDocument } from './models';
import type { ExpenseDisplay } from './schemas';

export function mapModelToDisplay(expense: ExpenseDocument): ExpenseDisplay {
  const obj = expense.toObject ? expense.toObject() : expense;
  const userId
    = obj.user?._id?.toString?.()
      ?? (typeof obj.user === 'string' ? obj.user : obj.user?.toString?.());

  return {
    id: obj._id.toString(),
    description: obj.description,
    price: obj.price,
    quantity: obj.quantity,
    totalPrice: obj.totalPrice,
    category: obj.category,
    date: obj.date,
    user: { id: userId },
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}
