import type { HttpHandler } from 'msw';
import { errorHandlers } from './handlers/error-handlers';
import { expenseHandlers } from './handlers/expense-handlers';

const handlers: HttpHandler[] = [
  ...errorHandlers,
  ...expenseHandlers,
];

export { handlers };
