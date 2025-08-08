import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import { LogEvents } from '@/constants/log-events';
import { getUserById } from '@/features/users/data';
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
        const userData = await getUserById(user.id!);

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
    async signIn(message) {
      const logger = createLogger('auth/events');

      logger.info(LogEvents.AUTH_SIGN_IN, {
        provider: (message as any)?.account?.provider,
        userId: (message as any)?.user?.id,
        status: 'ok',
      });
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
