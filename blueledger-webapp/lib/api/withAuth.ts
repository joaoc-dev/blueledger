import { auth } from '@/lib/auth/auth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

type Handler<P = undefined> = (
  request: NextAuthRequest,
  context: P extends undefined ? Record<string, never> : { params: P }
) => Promise<NextResponse>;

export function withAuth<P = undefined>(handler: Handler<P>) {
  return auth(async function (request: NextAuthRequest, context) {
    if (!request.auth || !request.auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(
      request,
      context as P extends undefined ? Record<string, never> : { params: P }
    );
  });
}
