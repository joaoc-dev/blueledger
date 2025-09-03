import { handlers } from '@/lib/auth/auth';

/**
 * NextAuth.js API route handlers
 *
 * Handles authentication requests including:
 * - GET /api/auth/[...nextauth] - OAuth callbacks, session management
 * - POST /api/auth/[...nextauth] - Sign in, sign out, and other auth actions
 *
 * This route is automatically configured by NextAuth.js and handles
 * all authentication flows including providers, sessions, and callbacks.
 */
export const { GET, POST } = handlers;
