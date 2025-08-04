import { ExpenseDisplay } from '@/features/expenses/schemas';

import NumericDisplay from '@/components/shared/numeric-display';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CATEGORY_ICONS, ExpenseCategory } from '@/features/expenses/constants';
import { CircleEllipsis, Dot } from 'lucide-react';
import ExpenseActions from '../expense-actions';

interface CardProps {
  expense: ExpenseDisplay;
}

export const ListCard = ({ expense }: CardProps) => {
  const Icon =
    expense.category && expense.category in CATEGORY_ICONS
      ? CATEGORY_ICONS[expense.category as ExpenseCategory]
      : CircleEllipsis;

  return (
    <Card className="h-40 py-4">
      <div className="w-full grid grid-rows-3 h-full">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-8 w-8 shrink-0" />
            <span className="line-clamp-2 break-words">
              {expense.description}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-muted-foreground justify-between px-">
          <div className="text-sm flex items-center max-w-[clamp(7rem,30vw,18rem)]">
            <NumericDisplay value={expense.price} format="currency" />
            <Dot />
            <NumericDisplay value={expense.quantity} format="number" />
          </div>
          <NumericDisplay
            className="text-lg max-w-[clamp(8rem,30vw,20rem)]"
            value={expense.totalPrice}
            format="currency"
          />
        </CardContent>
        <CardFooter className="flex justify-between gap-8 px-4">
          <ExpenseActions
            disabled={!!expense.optimisticId}
            id={expense.id!}
            isCompact={false}
          />
        </CardFooter>
      </div>
    </Card>
  );
};
