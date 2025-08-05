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
import { format } from 'date-fns';

interface CardProps {
  expense: ExpenseDisplay;
}

export const ListCard = ({ expense }: CardProps) => {
  const Icon =
    expense.category && expense.category in CATEGORY_ICONS
      ? CATEGORY_ICONS[expense.category as ExpenseCategory]
      : CircleEllipsis;

  return (
    <Card className="h-46 py-4">
      <div className="w-full grid grid-rows-[auto_1fr_auto] h-full">
        <CardHeader className="px-4">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-8 w-8 shrink-0" />
            <span className="line-clamp-2 break-words pr-4">
              {expense.description}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 justify-center">
          <div className="flex items-center gap-2 text-muted-foreground justify-between">
            <div className="text-sm flex items-center max-w-[clamp(7rem,30vw,18rem)]">
              <NumericDisplay value={expense.price} format="currency" />
              <Dot />
              <NumericDisplay value={expense.quantity} format="number" />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm">Total</span>
              <NumericDisplay
                className="text-lg max-w-[clamp(8rem,30vw,20rem)]"
                value={expense.totalPrice}
                format="currency"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground justify-between">
            <span>{format(expense.date, 'MMM d, yyyy')}</span>
            <span>{format(expense.date, 'HH:mm')}</span>
          </div>
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
