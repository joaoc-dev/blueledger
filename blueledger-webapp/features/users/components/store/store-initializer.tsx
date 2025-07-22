'use client';

import { useEffect } from 'react';
import { useUserStore } from './store';
import { useUserProfile } from '@/features/users/hooks';

export default function UserProfileStoreInitializer() {
  const { data: user } = useUserProfile();
  const setImage = useUserStore((state) => state.setImage);
  const setName = useUserStore((state) => state.setName);
  const setEmail = useUserStore((state) => state.setEmail);
  const setBio = useUserStore((state) => state.setBio);

  useEffect(() => {
    setImage(user?.image || undefined);

    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
    if (user?.bio) setBio(user.bio);
  }, [user, setImage, setName, setEmail, setBio]);

  return null;
}
