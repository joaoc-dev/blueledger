export interface ExpenseType {
  id: string;
  description: string;
  price: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}
