import mongoose, { Schema, Document } from 'mongoose';

export interface Expense extends Document {
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Expense ||
  mongoose.model<Expense>('Expense', ExpenseSchema);
