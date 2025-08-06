import { ExpenseDocument } from './model';
import { ExpenseDisplay } from './schemas';

export function mapModelToDisplay(expense: ExpenseDocument): ExpenseDisplay {
  const obj = expense.toObject();
  return {
    id: obj._id.toString(),
    description: obj.description,
    price: obj.price,
    quantity: obj.quantity,
    totalPrice: obj.totalPrice,
    category: obj.category,
    date: obj.date,
    user: { id: obj.user.toString() },
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}
