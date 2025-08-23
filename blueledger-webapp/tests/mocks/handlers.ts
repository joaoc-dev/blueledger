import type { HttpHandler } from 'msw';
import { errorHandlers } from './handlers/error-handlers';
import { expenseHandlers } from './handlers/expense-handlers';
import { notificationHandlers } from './handlers/notifications';

const handlers: HttpHandler[] = [
  ...errorHandlers,
  ...expenseHandlers,
  ...notificationHandlers,
];

export { handlers };
