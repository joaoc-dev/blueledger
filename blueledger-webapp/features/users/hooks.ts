import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getUser } from './client';
import {
  UserDisplay,
  UserProfileFormData,
  userProfileFormSchema,
} from './schemas';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: getUser,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export const useUserProfileForm = (user?: UserDisplay) => {
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
    },
  });

  return form;
};
