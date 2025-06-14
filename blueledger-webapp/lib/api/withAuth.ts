import { auth } from '@/lib/auth/auth';
import { NextAuthRequest } from 'next-auth';
import { NextResponse } from 'next/server';

type Handler<P = undefined> = (
  req: NextAuthRequest,
  // eslint-disable-next-line
  context: P extends undefined ? {} : { params: P }
) => Promise<NextResponse>;

export function withAuth<P = undefined>(handler: Handler<P>) {
  return auth(async function (req: NextAuthRequest, context) {
    if (!req.auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // eslint-disable-next-line
    return handler(req, context as P extends undefined ? {} : { params: P });
  });
}
