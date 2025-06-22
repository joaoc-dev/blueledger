// Split configuration due to MongoDB adapter and edge runtime
// https://authjs.dev/guides/edge-compatibility
import GitHub from 'next-auth/providers/github';
import type { NextAuthConfig } from 'next-auth';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [GitHub],
} satisfies NextAuthConfig;
