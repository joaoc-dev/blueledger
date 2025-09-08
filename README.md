# Blueledger is a showcase application.

A modern, performant, mobile-friendly expense-tracking web app with advanced UI/UX and AI integration.

[![CI - main](https://img.shields.io/github/actions/workflow/status/joaoc-dev/blueledger/ci.yaml?branch=main&label=CI%20%7C%20main)](https://github.com/joaoc-dev/blueledger/actions/workflows/ci.yaml)
[![CI - dev](https://img.shields.io/github/actions/workflow/status/joaoc-dev/blueledger/ci.yaml?branch=dev&label=CI%20%7C%20dev)](https://github.com/joaoc-dev/blueledger/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/joaoc-dev/blueledger/graph/badge.svg?token=RIY2M5BVU1)](https://codecov.io/gh/joaoc-dev/blueledger)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

### Built with:

- ⏭️ Next.js 15.5.2 (App Router)
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
- 📋 Custom grid/list display powered by TanStack Table
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
- 📖 Logging with next-axiom and Axiom
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

We use **MongoDB Atlas Local (via Docker)** in development to enable support for [transactions](https://www.mongodb.com/docs/manual/core/transactions/) and vector search.

Start the local database with Docker Compose:

```bash
docker compose up -d
```

Create the required Atlas Search vector indexes:

- Name each index the same as the JSON file name
- In MongoDB Atlas (or Compass): go to your collection → Indexes → Create Search Index → JSON Editor → paste the contents from `features/chatbot/indexes/<file>.json` and save


Then set up and run the app:

1. Install dependencies

```bash
pnpm install
```

2. Configure environment variables (use `.env.example` as a template and fill in values)

3. Seed the database

```bash
pnpm seed
```

4. Start the development server

```bash
pnpm dev
```

### Features

## 🏠 Landing Page

Landing page powered by Framer Motion animations and premium UX.

Features smooth scroll-triggered reveals, and a minimalist look.

![Landing Demo](clips/landing.gif)

## 🔐 Authentication System

Secure, multi-provider authentication with email verification and password reset capabilities.

### Core Authentication Features

- **Multi-Provider Support**: Email/password credentials + GitHub OAuth integration
- **Email Verification**: 6-digit OTP verification system for account security
- **Password Reset**: Secure password recovery with email-based verification
- **Automatic Account Linking**: Seamless connection between different auth providers
- **Session Management**: JWT-based sessions with MongoDB adapter
- **Password Hashing**: bcrypt for secure password storage

### Authentication Flows

#### Sign Up & Email Verification

1. User registers with name, email, and password
2. Account created and user automatically signed in
3. 6-digit verification code sent to email
4. Email verification required before accessing the app
5. Anti-spam cooldown with rate limiting

#### Sign In Options

- **Email/Password**: Traditional credential-based authentication
- **GitHub OAuth**: One-click authentication with GitHub
  - Automatic account creation/linking
  - Email verification required for new GitHub users (first-time sign-in)
- **Automatic Linking**: Connect multiple providers to single account

#### Password Recovery

- Forgot password flow with email verification
- 6-digit reset codes sent via email
- Anti spam rate-limit
- Secure password update with strength validation

![Auth OTP Demo](clips/auth-otp.gif)

## 👤 Profile Management

**Seamless profile updates powered by Zustand** with custom image cropper and Cloudinary integration.

- **Custom Image Cropper with Live Preview**
- **Cloudinary Integration**
- **Global Profile Store for Centralized State**
- **Optimistic Updates providing Instant UI Feedback**
- **Drag & Drop**

![Profile Demo](clips/profile.gif)

## 📊 Dashboard & Analytics

**Interactive expense analytics dashboard** with 5 powerful charts and interactive tooltips all powered by Recharts.

- **Cumulative Spend YTD**: Line chart tracking monthly spending accumulation with running totals and transaction counts
- **Day of Week Patterns**: Bar chart showing average daily spending across all days in date range (Monday-Sunday)
- **Hour of Day Analysis**: Bar chart revealing average spending patterns by hour (0-23) across entire date range
- **Category Share Distribution**: Stacked bar chart showing monthly spending breakdown across all expense categories
- **Seasonal Spending Trends**: Seasonal analysis with spending totals, transaction counts, and percentage breakdowns

![Dashboard Demo](clips/dashboard.gif)

## 🔔 Live Notifications

**Real-time notification system powered by Pusher**.

- **Instant Updates**: Pusher-powered real-time delivery of notifications
- **Unread Count Badges**: Live counter updates powered by Zustand state management
- **Notification Panel**: Virtualized list with chronological feed, smoothly animated by Motion
- **Priority Levels**: Color-coded notifications by importance
- **Mark as Read**: Bulk and individual notification management

![Notifications Demo](clips/notifications.gif)

## 📋 Dynamic Data Tables

**Advanced data table system** powered by TanStack Table and dnd-kit with full customization and performance optimization using memoization and state management.

### Grid Configuration

- **Column Resizing**: Live column width adjustment with persistent settings
- **Drag & Drop Reordering**: Intuitive column reordering with dnd-kit
- **Column Visibility**: Show/hide columns with user preference persistence
- **Advanced Filtering with URL Sync**: Category filters, date range filters, and text search synced to URL parameters for shareable views
- **Persistent Settings**: User preferences saved across sessions and refreshes

### Responsiveness

- **Desktop Mode**: Full data table with all advanced features
- **Mobile Mode**: Stacked list view
- **Breakpoint Management**: Automatic layout switching based on screen size

![Dynamic UI Demo](clips/dynamicui.gif)

## 👥 Friendship System

**Social networking** for connecting users with friend requests and real-time updates.

- **Real-time Notifications**: Live updates on new friendship requests
- **Optimistic UI**: Immediate feedback for friendship actions

### Discovery and Integration

- **Add by Email**: Search and send friend requests to other users
- **Request Management**: Accept, decline, or cancel friend requests
- **Group Integration**: Seamlessly invite friends to groups

### Management

- **Active Friendships**: View all accepted friends
- **Pending Requests**: Track outgoing and incoming friend requests
- **Sortable Friend List**: Organize friends by name, status, or date added
- **Remove Friendships**: Clean removal of unwanted connections

![Friends Demo](clips/friends.gif)

## 👥 Group System

**Collaborative expense sharing** with group creation and member management.

- **Real-time Notifications**: Live updates on new membership invites
- **Optimistic UI**: Immediate feedback for group actions
- **Permission Controls**: Role-based access to group actions

### Group Creation

- **Create and Update Groups**: Set group name and optional avatar image
- **Owner Assignment**: Automatic owner role for group creator

### Roles & Permissions

#### Owner

- **Invitations**: Add existing friends or invite by email
- **Cancel Invites**: Revoke pending invitations
- **Remove Members**: Remove group memberships
- **Ownership Transfer**: Transfer group ownership to other members

![Group Owner Demo](clips/group-owner.gif)

#### Member

- **Invitations**: Accept or decline group invitations
- **Leave Group**: Voluntary leave group
- **View Members**: See active group members
- **Limited Access**: Read-only access to group information

![Group Member Demo](clips/group-member.gif)

## 💰 Expenses

- **Optimistic UI**: Immediate feedback for expense actions
- **Advanced Form**: Custom inputs with validation for description, quantity, price, category, date
- **Advanced Filtering**: Category filters, date ranges, text search

![Expenses Demo](clips/expenses.gif)

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

## API Endpoints Overview

### 🔐 Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/verification-code/send` - Send email verification
- `POST /api/auth/verification-code/confirm` - Confirm email verification
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset
- `POST /api/pusher/auth` - Pusher authentication

### 👤 Users

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update user profile
- `POST /api/users/lookup` - Lookup user by email
- `POST /api/users/image` - Upload user avatar

### 💰 Expenses

- `GET /api/expenses` - List user expenses
- `POST /api/expenses` - Create new expense
- `PATCH /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense

### 👥 Friendships

- `GET /api/friendships` - List user friendships
- `POST /api/friendships/invite` - Send friend request
- `POST /api/friendships/[id]/accept` - Accept friend request
- `POST /api/friendships/[id]/decline` - Decline friend request
- `POST /api/friendships/[id]/cancel` - Cancel friend request
- `DELETE /api/friendships/[id]/remove` - Remove friendship

### 👥 Groups

- `POST /api/groups` - Create new group
- `PATCH /api/groups/[id]` - Update group
- `DELETE /api/groups/[id]` - Delete group
- `GET /api/groups/[id]/invitable-friends` - Get list of user's friends who can be invited to the group
- `PATCH /api/groups/[id]/transfer` - Transfer group ownership

### 👥 Group Memberships

- `GET /api/memberships` - Retrieves all group memberships for the authenticated user
- `GET /api/groups/[id]/memberships` - List group members
- `POST /api/groups/[id]/memberships` - Invite user to group
- `PATCH /api/groups/[id]/memberships/[membershipId]/accept` - Accept group invite
- `PATCH /api/groups/[id]/memberships/[membershipId]/decline` - Decline group invite
- `PATCH /api/groups/[id]/memberships/[membershipId]/cancel` - Cancel group invite
- `PATCH /api/groups/[id]/memberships/[membershipId]/kick` - Remove member
- `PATCH /api/groups/[id]/memberships/[membershipId]/leave` - Leave group

### 🔔 Notifications

- `GET /api/notifications` - List user notifications
- `PATCH /api/notifications/[id]` - Update notification
- `PATCH /api/notifications/mark-all-read` - Mark all notifications as read

### 📊 Dashboard

- `GET /api/dashboard` - Get dashboard analytics data

## Conventions

### File naming

|                       | Convention                  | Example                                    |
| --------------------- | --------------------------- | ------------------------------------------ |
| File & folder names   | kebab-case                  | `nav-bar-mobile.tsx`, `nav-bar/`           |
| Custom hooks          | camelCase with `use` prefix | `useExpenses`, `useFriends`                |
| Variables & functions | camelCase                   | `expenses`, `getUserById()`                |
| Constants & enums     | UPPER_SNAKE_CASE            | `API_BASE`, `MAX_RETRY_COUNT`              |
| Next.js special files | lowercase exact names       | `page.tsx`, `layout.tsx`, `route.ts`, etc. |

### Project Structure

| Root        | File/Subfolder        | File/Subfolder          | Description                                                             |
| ----------- | --------------------- | ----------------------- | ----------------------------------------------------------------------- |
| app/        |                       |                         | **Used exclusively for routing, API handlers, and pages**               |
|             | (auth)/               |                         | Auth pages (login, register…)                                           |
|             | (protected)/          |                         | Main app pages (dashboard, expenses…)                                   |
|             | (public)/             |                         | Marketing pages (landing, about…)                                       |
|             | api/                  |                         | API route handlers and page routing                                     |
| components/ |                       |                         | **Reusable UI components used across the app**                          |
|             | layout/               |                         | Navigation components                                                   |
|             | shared/               |                         | Generic, reusable components                                            |
|             |                       | modal.tsx               |                                                                         |
|             |                       | confirmation-dialog.tsx |                                                                         |
|             |                       | ...                     |                                                                         |
|             | third-party/          |                         | Imported 3rd party components                                           |
|             |                       | calendar.tsx            |                                                                         |
|             | third-party-modified/ |                         | Modified versions of imported 3rd party components                      |
|             | ui/                   |                         | Shadcn/ui components                                                    |
|             | ui-modified/          |                         | Modified versions of Shadcn components                                  |
| constants/  |                       |                         | **Shared app-level constants (config, labels…)**                        |
|             | pusher-events.ts      |                         |                                                                         |
|             | query-keys.ts         |                         |                                                                         |
|             | ...                   |                         |                                                                         |
| env/        |                       |                         | **T3 type-safe wrappers for accessing environment variables using Zod** |
|             | server.ts             |                         | Server-only environment variables (e.g. secrets).                       |
|             | client.ts             |                         | Public variables exposed to the client (must start with NEXT*PUBLIC*).  |
| features/   |                       |                         | **Feature-scoped code**                                                 |
|             | feature-name/         |                         |                                                                         |
|             |                       | components/             | Feature-specific UI components                                          |
|             |                       | client.ts               | Client-side API functions                                               |
|             |                       | constants.ts            | Feature-specific constants                                              |
|             |                       | data.ts                 | Server-side database access                                             |
|             |                       | hooks.ts                | Custom React hooks                                                      |
|             |                       | mapper-client.ts        | Client-side data mapping                                                |
|             |                       | mapper-server.ts        | Server-side data mapping                                                |
|             |                       | model.ts                | TypeScript interfaces/types                                             |
|             |                       | schemas.ts              | Zod validation schemas                                                  |
|             |                       | service.ts              | Integration between multiple features                                   |
| hooks/      |                       |                         | **Shared app-level hooks**                                              |
|             | useIsMobile.ts        |                         |                                                                         |
|             | useLocalStorage.ts    |                         |                                                                         |
|             | ...                   |                         |                                                                         |
| lib/        |                       |                         | **App level setup and utilities**                                       |
|             | api/                  |                         | API utilities and wrappers                                              |
|             | auth/                 |                         | Auth.js setup & config                                                  |
|             | data/                 |                         | Dummy mock data                                                         |
|             | db/                   |                         | Database connection setup                                               |
|             | api-client            |                         | Custom API client wrapper                                               |
|             | ...                   |                         |                                                                         |
| scripts/    |                       |                         | **Contains utility scripts to populate the database for demo/testing**  |

## Note

`third-party/calendar.tsx` in an imported third party component: https://date-picker.luca-felix.com/

If modifications to third party components are needed, copy the component to `components/third-party-modified/`.

If modifications to ShadCN components are needed, copy the component to `components/ui-modified/`.

This allows you to safely compare diffs when updates are released and avoid breaking the app by modifying base components directly.
