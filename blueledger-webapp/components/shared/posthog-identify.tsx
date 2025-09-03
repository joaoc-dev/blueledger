'use client';

import { useSession } from 'next-auth/react';
import posthog from 'posthog-js';
import { useEffect } from 'react';

export default function PostHogIdentify() {
  const { data } = useSession();

  useEffect(() => {
    const userId = data?.user?.id;
    if (!userId)
      return;
    const hasAvatar = Boolean(data?.user?.image);
    const hasBio = Boolean((data as any)?.user?.bio);
    const emailVerified = Boolean(data?.user?.emailVerified);

    posthog.identify(userId, {
      has_avatar: hasAvatar,
      has_bio: hasBio,
      email_verified: emailVerified,
    });
  }, [data]);

  return null;
}
