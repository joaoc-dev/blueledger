import type { NextAuthConfig } from 'next-auth';
// Split configuration due to MongoDB adapter and edge runtime
// https://authjs.dev/guides/edge-compatibility
import GitHub from 'next-auth/providers/github';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [GitHub],
  pages: {
    signIn: '/auth/signin',
  },
} satisfies NextAuthConfig;
