'use client';

import { useEffect } from 'react';
import useUserStore from '@/app/(protected)/store';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function UserProfileStoreInitializer() {
  const { data } = useUserProfile();
  const setImage = useUserStore((state) => state.setImage);
  const setName = useUserStore((state) => state.setName);
  const setEmail = useUserStore((state) => state.setEmail);
  const setBio = useUserStore((state) => state.setBio);

  useEffect(() => {
    if (!data) return;
    setImage(data.image || undefined);
    if (data.name) setName(data.name);
    if (data.email) setEmail(data.email);
    if (data.bio) setBio(data.bio);
  }, [data]);

  return null;
}
