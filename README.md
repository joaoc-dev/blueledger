# Blueledger is a showcase application.

A modern, performant expense-tracking web app with advanced UI/UX and AI integration.

[![CI - main](https://img.shields.io/github/actions/workflow/status/joaoc-dev/blueledger/ci.yaml?branch=main&label=CI%20%7C%20main)](https://github.com/joaoc-dev/blueledger/actions/workflows/ci.yaml)

[![CI - dev](https://img.shields.io/github/actions/workflow/status/joaoc-dev/blueledger/ci.yaml?branch=dev&label=CI%20%7C%20dev)](https://github.com/joaoc-dev/blueledger/actions/workflows/ci.yaml)


### Built with:

- ⚛️ Next.js 15.4.5 (App Router)
- 🌐 RESTful API via Next.js App Router (`app/api`) — consumed with an Axios client wrapper
- 🧩 Composable utility classes by Tailwind
- 🎨 Customized Shadcn UI components
- 🍃 MongoDB + 📦 Mongoose ODM
- 🔒 Auth.js
  - JWT Strategy
  - GitHub OAuth
  - MongoDB adapter
- 🧊 Modals with Parallel + Intercepting Routes
- 🔄 Data fetching, caching, and optimistic updates powered by TanStack Query
- 📊 Custom grid/list display powered by TanStack Table
- 📜 Smooth rendering of large data sets powered by TanStack Virtual
- 🧲 Drag and drop by dndkit
- 🔔 Real time notifications by Pusher
- 🎞️ Smooth UI animations by Motion
- 🖼️ Image hosting via Cloudinary + 🧑 Custom avatar crop & upload widget
- 🐻 Seamless user profile updates and notifications by Zustand
- 📝 Form handling by React Hook Form
- ✅ Schema Validations by Zod
- 🌱 Type-safe environment variables by T3 Env
- 🧹 Code Linting with ESLint (Antfu configuration)
- 🛡️ Strict Typescript configuration
- ✂️ Declutter of unused files and dependencies by Knip
- 🤖 Automated dependency updates by Dependabot
- 🚀 Automated versioning and changelog generation by semantic-release
- 🐰 AI Code Reviews by CodeRabbit
- 🛰️ Performance monitoring and error tracking by Sentry

## ai-service

Responsible for interacting with Azure in order to provide the web-app with advanced AI-features.

- Automatic extraction of information from user uploaded receipts.

## web-app

### Features

### File naming

|                       | Convention                  | Example                                    |
| --------------------- | --------------------------- | ------------------------------------------ |
| File & folder names   | kebab-case                  | `nav-bar-mobile.tsx`, `nav-bar/`           |
| Custom hooks          | camelCase with `use` prefix | `useExpenses`, `useFriends`                |
| Variables & functions | camelCase                   | `expenses`, `getUserById()`                |
| Constants & enums     | UPPER_SNAKE_CASE            | `API_BASE`, `MAX_RETRY_COUNT`              |
| Next.js special files | lowercase exact names       | `page.tsx`, `layout.tsx`, `route.ts`, etc. |

### Project Structure

| Root        | File/Subfolder        | File/Subfolder          | Description                                                            |
| ----------- | --------------------- | ----------------------- | ---------------------------------------------------------------------- |
| app/        |                       |                         | **Used exclusively for routing, API handlers, and pages**              |
|             | (auth)/               |                         | Auth pages (login, register…)                                          |
|             | (protected)/          |                         | Main app pages (dashboard, expenses…)                                  |
|             | (public)/             |                         | Marketing pages (landing, about…)                                      |
|             | api/                  |                         | API route handlers and page routing                                    |
| components/ |                       |                         | **Reusable UI components used across the app**                         |
|             | layout/               |                         | Navigation components                                                  |
|             | shared/               |                         | Generic, reusable components                                           |
|             |                       | modal.tsx               |                                                                        |
|             |                       | confirmation-dialog.tsx |                                                                        |
|             |                       | ...                     |                                                                        |
|             | third-party/          |                         | Imported 3rd party components                                          |
|             |                       | calendar.tsx            |                                                                        |
|             | third-party-modified/ |                         | Modified versions of imported 3rd party components                     |
|             | ui/                   |                         | Shadcn/ui components                                                   |
|             | ui-modified/          |                         | Modified versions of Shadcn components                                 |
| constants/  |                       |                         | **Shared app-level constants (config, labels…)**                       |
|             | pusher-events.ts      |                         |                                                                        |
|             | query-keys.ts         |                         |                                                                        |
|             | ...                   |                         |                                                                        |
| env/        |                       |                         | **T3 type-safe wrappers for accessing environment variables using Zod**|
|             | client.ts             |                         | Server-only environment variables (e.g. secrets).                      |
|             | server.ts             |                         | Public variables exposed to the client (must start with NEXT_PUBLIC_). |
| features/   |                       |                         | **Feature-scoped code**                                                |
|             | feature-name/         |                         |                                                                        |
|             |                       | components/             | Feature-specific UI components                                         |
|             |                       | client.ts               | Client-side API functions                                              |
|             |                       | constants.ts            | Feature-specific constants                                             |
|             |                       | data.ts                 | Server-side database access                                            |
|             |                       | hooks.ts                | Custom React hooks                                                     |
|             |                       | mapper-client.ts        | Client-side data mapping                                               |
|             |                       | mapper-server.ts        | Server-side data mapping                                               |
|             |                       | model.ts                | TypeScript interfaces/types                                            |
|             |                       | schemas.ts              | Zod validation schemas                                                 |
| hooks/      |                       |                         | **Shared app-level hooks**                                             |
|             | useIsMobile.ts        |                         |                                                                        |
|             | useLocalStorage.ts    |                         |                                                                        |
|             | ...                   |                         |                                                                        |
| lib/        |                       |                         | **App level setup and utilities**                                      |
|             | api/                  |                         | API utilities and wrappers                                             |
|             | auth/                 |                         | Auth.js setup & config                                                 |
|             | data/                 |                         | Dummy mock data                                                        |
|             | db/                   |                         | Database connection setup                                              |
|             | api-client            |                         | Custom API client wrapper                                              |
|             | ...                   |                         |                                                                        |
| scripts/    |                       |                         | **Contains utility scripts to populate the database for demo/testing** |

## Note

`third-party/calendar.tsx` in an imported third party component: https://date-picker.luca-felix.com/

If modifications to third party components are needed, copy the component to `components/third-party-modified/`.
If modifications to ShadCN components are needed, copy the component to `components/ui-modified/`.

This allows you to safely compare diffs when updates are released and avoid breaking the app by modifying base components directly.
