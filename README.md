# Blueledger is a showcase application.

A modern, performant expense-tracking web app with advanced UI/UX and AI integration.

[![CI - main](https://img.shields.io/github/actions/workflow/status/joaoc-dev/blueledger/ci.yaml?branch=main&label=CI%20%7C%20main)](https://github.com/joaoc-dev/blueledger/actions/workflows/ci.yaml)
[![CI - dev](https://img.shields.io/github/actions/workflow/status/joaoc-dev/blueledger/ci.yaml?branch=dev&label=CI%20%7C%20dev)](https://github.com/joaoc-dev/blueledger/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/joaoc-dev/blueledger/graph/badge.svg?token=RIY2M5BVU1)](https://codecov.io/gh/joaoc-dev/blueledger)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

### Built with:

- ⏭️ Next.js 15.4.5 (App Router)
- ⚛️ App optimization with [React Compiler](https://react.dev/learn/react-compiler)
- 🌐 RESTful API via Next.js App Router (`app/api`) — consumed with an Axios client wrapper
- 🧩 Composable utility classes by Tailwind
- 🎨 Customized Shadcn UI components
- 🍃 MongoDB + 📦 Mongoose ODM
- 🐳 Dockerized MongoDB for local development (DX)
- 🔒 Auth.js
  - JWT Strategy
  - GitHub OAuth
  - Credentials Auth
  - Automatic Account linking
  - Email verification
  - MongoDB adapter
  - Custom pages supported by NextJS server actions
- 📬 Resend + 📨 React Email
- 🚧 Rate limiting powered by Upstash
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
- 🧪 Unit and Integration Tests with Vitest/Vitest Browser Mode
  - MongoDB Memory Server
  - API mocking by mswjs
- ☂️ Code coverage with Codecov
- 📝 Logging with next-axiom and Axiom
- 🐗 Product analytics powered by PostHog
- 🔍 Local error detection and debugging by Sentry Spotlight
- 🛰️ Performance monitoring and error tracking by Sentry
- 🧹 Code Linting with ESLint (Antfu configuration)
- 🛡️ Strict Typescript configuration
- ✂️ Declutter of unused files and dependencies by Knip
- 🤖 Automated dependency updates by Dependabot
- 🚀 Automated versioning and changelog generation by semantic-release
- 🐰 AI Code Reviews by CodeRabbit
- ⚙️ Continuous Integration powered by GitHub Actions
  - Type-checking, linting, dependency checks
  - Test execution with coverage reports uploaded to Codecov
  - Release automation via semantic-release

## 🚀 Getting Started (Development)

We use **Docker** to run a local MongoDB replica set in development to enable support for [transactions](https://www.mongodb.com/docs/manual/core/transactions/).

1. Start MongoDB in Docker:
   ```bash
   docker-compose up -d
   ```

2. Initialize the replica set (only required the first time):
   ```bash
   docker exec blueledger-mongo-dev-rs mongosh --eval "rs.initiate({_id: 'rs0', members: [{ _id: 0, host: 'host.docker.internal:27030' }]})"
   ```

3. Start the dev server
   ```bash
   pnpm dev
   ```
## ai-service

Responsible for interacting with Azure in order to provide the web-app with advanced AI-features.

- Automatic extraction of information from user uploaded receipts.

## web-app

### Features

### Testing

**Unit vs. Storybook**

- Keep Vitest focused on pure logic (mappers, schemas, data-table utils); use Storybook for complex UI behavior.

Example:

- High‑interaction table UX.
- **Variants**: default, filtered, sorted, empty, error.
- **Data mocking**: use `msw` in Storybook to provide realistic data, errors, and artificial delays.
- **Interactions**: write `play()` tests with `@storybook/test`:
  - toolbar actions (search, filters, view options, reset, export)
  - pagination and sorting (headers, next/prev, page size)
  - column drag/reorder/resize and pin/unpin

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
|             | server.ts             |                         | Server-only environment variables (e.g. secrets).                      |
|             | client.ts             |                         | Public variables exposed to the client (must start with NEXT_PUBLIC_). |
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
