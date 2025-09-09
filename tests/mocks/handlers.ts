import type { HttpHandler } from 'msw';
import { errorHandlers } from './handlers/error-handlers';
import { expenseHandlers } from './handlers/expense-handlers';
import { notificationHandlers } from './handlers/notifications';
import { userHandlers } from './handlers/users';

const handlers: HttpHandler[] = [
  ...errorHandlers,
  ...expenseHandlers,
  ...notificationHandlers,
  ...userHandlers,
];

export { handlers };
