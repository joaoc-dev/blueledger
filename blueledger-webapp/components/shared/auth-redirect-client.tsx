'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirectClient() {
  const pathname = usePathname();

  useEffect(() => {
    window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
      pathname,
    )}`;
  }, [pathname]);

  return null;
}
