import type { Document, Model, ObjectId } from 'mongoose';
import type { ExpenseCategory } from './constants';
import mongoose, { Schema } from 'mongoose';
import { EXPENSE_CATEGORIES } from './constants';

// This interface represents the properties of an Expense document
interface IExpense {
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  category: ExpenseCategory;
  date: Date;
  user: ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

// This interface represents an Expense document with Mongoose methods
export interface ExpenseDocument extends IExpense, Document {}

// This interface represents the Expense model with static methods
interface ExpenseModel extends Model<ExpenseDocument> {
  // Add any static methods here
}

const ExpenseSchema = new Schema<ExpenseDocument>(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxLength: [200, 'Description must be less than 200 characters'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      required: [true, 'Category is required'],
      maxLength: [50, 'Category must be less than 50 characters'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  },
);

// This is the key part - we need to specify both the document type and model type
const Expense
  = (mongoose.models.Expense as ExpenseModel)
    || mongoose.model<ExpenseDocument, ExpenseModel>('Expense', ExpenseSchema);

export default Expense;
