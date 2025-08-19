import { MongoDBAdapter } from '@auth/mongodb-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { validateRequest } from '@/app/api/validateRequest';
import { LogEvents } from '@/constants/log-events';
import { issueVerificationCodeForUser } from '@/features/auth/data';
import { signInSchema } from '@/features/auth/schemas';
import { getUserAuthRecordByEmail, getUserAuthRecordById } from '@/features/users/data';
import { createLogger } from '@/lib/logger';
import clientPromise from '../db/mongoDB-client';
import authConfig from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  // Merge edge-safe config, then add Node-only providers (like Credentials)
  ...authConfig,
  providers: [
    ...(authConfig.providers ?? []),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const logger = createLogger('auth/callbacks/authorize');
        const requestId = globalThis.crypto?.randomUUID?.();
        const startTime = Date.now();

        const validationResult = validateRequest(signInSchema, credentials);
        if (!validationResult.success) {
          logger.warn(LogEvents.VALIDATION_FAILED, {
            requestId,
            details: validationResult.error.details,
            status: 400,
            durationMs: Date.now() - startTime,
          });

          return null;
        }

        const { email, password } = validationResult.data;

        const user = await getUserAuthRecordByEmail(email);
        if (!user || !user.passwordHash)
          return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
          return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        } as any;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  /*
   * Callback lifecycle (with session.strategy = 'jwt')
   *
   * - jwt callback
   *   - Runs on sign in with `trigger === 'signIn'` and `user` populated (good place to seed token fields)
   *   - Runs on client/server session reads (auth/getServerSession/useSession) to load/refresh the JWT
   *   - Runs on `await update()` called on the client with `trigger === 'update'` and session fields provided
   *
   * - session callback
   *   - Runs after the jwt callback on each session read to shape `session.user` from the token
   */
  callbacks: {
    // Seed and refresh JWT. See lifecycle note above.
    async jwt({ token, user, trigger, session }) {
      const logger = createLogger('auth/callbacks');

      logger.info(LogEvents.AUTH_JWT, {
        userId: user?.id,
        tokenSub: token?.sub,
        trigger,
        status: 'ok',
      });

      if (user) {
        const userData = await getUserAuthRecordById(user.id!);

        if (userData) {
          token.id = userData.id;
          token.name = userData.name;
          token.email = userData.email;
          token.image = userData.image;
          token.bio = userData.bio;
          token.emailVerified = userData.emailVerified
            ? userData.emailVerified.toISOString()
            : null;
        }
      }

      // When update() is called on the client, merge the provided fields into the token
      // Use session.user only for safe fields (e.g., image, name, bio) and not for emailVerified
      if (trigger === 'update') {
        const updatedUser = session.user;
        if (updatedUser) {
          if ('image' in updatedUser)
            token.image = updatedUser.image;
          if ('name' in updatedUser)
            token.name = updatedUser.name;
          if ('bio' in updatedUser)
            token.bio = updatedUser.bio;
        }

        // Update emailVerified from DB
        const userId = token?.sub;
        if (userId) {
          const userData = await getUserAuthRecordById(userId);
          if (userData) {
            token.emailVerified = userData.emailVerified
              ? userData.emailVerified.toISOString()
              : null;
          }
        }
      }

      return token;
    },

    // Shape the session from the JWT. See lifecycle note above.
    async session({ session, token }) {
      const logger = createLogger('auth/callbacks');

      logger.info(LogEvents.AUTH_SESSION, {
        userId: token.id as string | undefined,
        status: 'ok',
      });

      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        image: token.image as string,
        bio: token.bio as string,
        emailVerified: token.emailVerified
          ? new Date(token.emailVerified as string)
          : null,
      };

      // If password was reset after token iat, invalidate session
      try {
        const userDoc = await getUserAuthRecordById(token.id as string);
        const invalidAfter = userDoc?.sessionInvalidAfter?.getTime();
        const tokenIat = (token as any)?.iat ? Number((token as any).iat) * 1000 : undefined;
        if (invalidAfter && tokenIat && tokenIat < invalidAfter) {
          // Returning null session signals invalid session to callers
          return null as any;
        }
      }
      catch {}

      return session;
    },
  },
  events: {
    async signIn({ account, user }) {
      const logger = createLogger('auth/events/signIn');

      logger.info(LogEvents.AUTH_SIGN_IN, {
        provider: account?.provider,
        userId: user?.id,
        status: 'ok',
      });

      try {
        const provider = account?.provider;
        const userId = user?.id;
        const emailVerified = user?.emailVerified as Date | null | undefined;

        const userData = await getUserAuthRecordById(userId!);
        const hasIssuedCode = userData?.emailVerificationCode;

        // If the user signed in with OAuth and has no emailVerified, and no issued code, proactively issue a code
        // For credentials, this happens at the signUp/register step
        if (provider && provider !== 'credentials' && userId && !emailVerified && !hasIssuedCode) {
          await issueVerificationCodeForUser(userId);
        }
      }
      catch {
        logger.error(LogEvents.AUTH_SIGN_IN, {
          provider: account?.provider,
          userId: user?.id,
          status: 'error',
        });
      }
    },
    async signOut(message) {
      const logger = createLogger('auth/events');

      logger.info(LogEvents.AUTH_SIGN_OUT, {
        userId: (message as any)?.token?.sub,
        status: 'ok',
      });
    },
  },
});
