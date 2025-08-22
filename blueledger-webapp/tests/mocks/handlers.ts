import type { HttpHandler } from 'msw';
import { expenseHandlers } from './handlers/expense-handlers';

const handlers: HttpHandler[] = [...expenseHandlers];

export { handlers };
