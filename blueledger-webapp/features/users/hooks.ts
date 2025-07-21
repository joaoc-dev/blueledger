import { getUser } from '@/features/users/client';
import {
  UserDisplay,
  UserProfileFormData,
  userProfileFormSchema,
} from '@/features/users/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

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
