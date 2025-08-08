'use client';

import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import { useEffect } from 'react';

export default function AuthRedirectClient() {
  const pathname = usePathname();

  useEffect(() => {
    posthog.capture('unauthorized_page_redirect', {
      path: pathname,
    });
    window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(
      pathname,
    )}`;
  }, [pathname]);

  return null;
}
