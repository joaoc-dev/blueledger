import { auth } from '@/lib/auth/auth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

type Handler<P = undefined> = (
  req: NextAuthRequest,
  context: P extends undefined ? Record<string, never> : { params: P }
) => Promise<NextResponse>;

export function withAuth<P = undefined>(handler: Handler<P>) {
  return auth(async function (req: NextAuthRequest, context) {
    if (!req.auth || !req.auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(
      req,
      context as P extends undefined ? Record<string, never> : { params: P }
    );
  });
}
