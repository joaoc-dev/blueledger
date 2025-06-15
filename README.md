# Blueleder is a showcase application.

It gives users the possibility of managing their expenses with the help of analytics and AI-features.

### Built with:

- ⚛️ Next.js 15
- 🧩 Composable utility classes by Tailwind
- 🎨 Customized Shadcn UI components
- 🍃 MongoDB + 📦 Mongoose ODM
- 🐰 AI Code Reviews by CodeRabbit
- 🛰️ Performance monitoring and error tracking by Sentry
- 📝 Form handling by React Hook Form
- ✅ Schema Validations by Zod

## ai-service

Responsible for interacting with Azure in order to provide the web-app with advanced AI-features.

- Automatic extraction of information from user uploaded receipts.

## web-app

# File naming

|                               | Convention                  | Example                                    |
| ----------------------------- | --------------------------- | ------------------------------------------ |
| File & folder names           | kebab-case                  | `nav-bar-mobile.tsx`, `nav-bar/`           |
| React component (inside file) | PascalCase                  | `export function ExpensesList()`           |
| Custom hooks                  | camelCase with `use` prefix | `useExpenses`, `useFriends`                |
| Variables & functions         | camelCase                   | `expenses`, `getUserById()`                |
| Constants & enums             | UPPER_SNAKE_CASE            | `API_BASE`, `MAX_RETRY_COUNT`              |
| Next.js special files         | lowercase exact names       | `page.tsx`, `layout.tsx`, `route.ts`, etc. |

# Project Structure

| Root        | Subfolder    | File/Subfolder          | Description                                                                              |
| ----------- | ------------ | ----------------------- | ---------------------------------------------------------------------------------------- |
| app/        |              |                         | **Used exclusively for routing, API handlers, and pages**                                |
|             | (auth)/      |                         | Auth pages (login, register…)                                                            |
|             | (protected)/ |                         | Main app pages (dashboard, expenses…)                                                    |
|             | (public)/    |                         | Marketing pages (landing, about…)                                                        |
|             | api/         |                         | API route handlers and page routing                                                      |
| components/ |              |                         | **Reusable UI components used across the app**                                           |
|             | custom/      |                         | Imported 3rd party components                                                            |
|             |              | calendar.tsx            |                                                                                          |
|             | nav-bar/     |                         | Feature-scoped navigation components                                                     |
|             |              | nav-bar.tsx             |                                                                                          |
|             |              | nav-bar-mobile.tsx      |                                                                                          |
|             |              | nav-bar-desktop.tsx     |                                                                                          |
|             | expenses/    |                         | Feature-scoped expense UI                                                                |
|             |              | expenses-table.tsx      |                                                                                          |
|             |              | expense-form.tsx        |                                                                                          |
|             | shared/      |                         | Generic, reusable components                                                             |
|             |              | modal.tsx               |                                                                                          |
|             |              | confirmation-dialog.tsx |                                                                                          |
|             | ui/          |                         | ShadCN UI primitives                                                                     |
|             |              | button.tsx              |                                                                                          |
|             |              | input.tsx               |                                                                                          |
| constants/  |              |                         | **Shared UI and app-level constants (icons, categories, config, labels…)**               |
|             |              | expense-category.ts     |                                                                                          |
| lib/        |              |                         | **Contains backend logic such as DB access, validation, auth setup, and shared schemas** |
|             | auth/        |                         | Auth.js setup & config                                                                   |
|             |              | auth.ts                 |                                                                                          |
|             |              | auth.config.ts          |                                                                                          |
|             | data/        |                         | Server-side DB operations (Mongoose).                                                    |
|             |              | users.ts                |                                                                                          |
|             |              | expenses.ts             |                                                                                          |
|             | db/          |                         | Mongoose connection setup                                                                |
|             |              | connection.ts           |                                                                                          |
|             | validations/ |                         | Zod schemas (used both client & server)                                                  |
|             |              | expense-schema.ts       |                                                                                          |
| hooks/      |              |                         | Client-side hooks for data fetching & state management                                   |
|             |              | use-expenses-form.ts    |                                                                                          |
| services/   |              |                         | Client-side API interaction functions                                                    |
|             | expenses     |                         |                                                                                          |
|             |              | expense-mapper.ts       | Mapping between types and API request/response                                           |
|             |              | expenses.ts             |                                                                                          |
|             | users        |                         |                                                                                          |
|             |              | users.ts                |                                                                                          |
| models/     |              |                         | Schema definitions for DB collections                                                    |
|             |              | user.model.ts           |                                                                                          |
|             |              | expense.model.ts        |                                                                                          |
| types/      |              |                         | Shared TypeScript interfaces & types                                                     |
|             |              | expense.ts              |                                                                                          |
|             |              | user.ts                 |                                                                                          |
| tests/      |              |                         | **Testing suites**                                                                       |
|             | unit/        |                         | Unit tests                                                                               |
|             | integration/ |                         | Integration/API tests                                                                    |

## Note

`custom/calendar.tsx` in an imported third party component: https://date-picker.luca-felix.com/

If modifications to ShadCN components are needed, copy the component to `components/shared/` and rename it (e.g. `custom-button.tsx`).
This allows you to safely compare diffs when ShadCN updates are released and avoid breaking the app by modifying base components directly.
