import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow
  if (
    pathname === '/' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // All other paths require auth
  if (!req.auth) {
    const loginUrl = new URL('/api/auth/signin', req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users continue
  return NextResponse.next();
});

export const config = {
  matcher: ['/:path*'],
};
