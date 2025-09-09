'use client';

import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import { useEffect } from 'react';

// In Next.js App Router, server layouts/components can't reliably access the current URL.
// This client-only component uses usePathname() to get the live route in the browser,
// so we can build an accurate callbackUrl for redirects due to lack of authentication.
export default function AuthRedirectClient() {
  const pathname = usePathname();

  useEffect(() => {
    posthog.capture('unauthorized_page_redirect', {
      path: pathname,
    });
    window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`;
  }, [pathname]);

  return null;
}
