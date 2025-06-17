import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { getUserById } from '../data/users';
import clientPromise from '../db/mongoDB-client';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userData = await getUserById(user.id!);

        if (userData) {
          token.id = userData.id;
          token.name = userData.name;
          token.email = userData.email;
          token.image = userData.image;
          token.bio = userData.bio;
          token.emailVerified = userData.emailVerified;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        image: token.image as string,
        bio: token.bio as string,
        emailVerified: token.emailVerified as Date | null,
      };
      return session;
    },
  },
});
