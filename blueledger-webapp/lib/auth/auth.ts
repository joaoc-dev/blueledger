import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import { LogEvents } from '@/constants/log-events';
import { issueVerificationCodeForUser } from '@/features/auth/data';
import User from '@/features/users/model';
import { createLogger } from '@/lib/logger';
import clientPromise from '../db/mongoDB-client';
import authConfig from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      const logger = createLogger('auth/callbacks');

      logger.info(LogEvents.AUTH_JWT, {
        userId: user?.id,
        trigger,
        status: 'ok',
      });

      if (user) {
        const userData = await User.findById(user.id!);

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

      // update the token with the updated user data
      if (trigger === 'update') {
        const updatedUser = session.user;
        if ('image' in updatedUser)
          token.image = updatedUser.image;
        if ('name' in updatedUser)
          token.name = updatedUser.name;
        if ('bio' in updatedUser)
          token.bio = updatedUser.bio;
      }
      return token;
    },

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
      return session;
    },
  },
  events: {
    async signIn({ account, user }) {
      const logger = createLogger('auth/events');

      logger.info(LogEvents.AUTH_SIGN_IN, {
        provider: account?.provider,
        userId: user?.id,
        status: 'ok',
      });

      // If the user signed in with OAuth and has no emailVerified, and no issued code, proactively issue a code
      // For credentials, this happens at the signUp/register step
      try {
        const provider = account?.provider;
        const userId = user?.id;
        const emailVerified = user?.emailVerified as Date | null | undefined;

        const userData = await User.findById(userId!);
        const hasIssuedCode = userData?.emailVerificationCode;

        if (provider && provider !== 'credentials' && userId && !emailVerified && !hasIssuedCode) {
          await issueVerificationCodeForUser(userId);
        }
      }
      catch {}
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
