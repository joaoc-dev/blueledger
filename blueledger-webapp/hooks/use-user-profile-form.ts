import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserProfileFormData,
  userProfileFormSchema,
} from '@/lib/validations/user-schema';
import { UserType } from '@/types/user';

export const useUserProfileForm = (user?: UserType) => {
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      bio: user?.bio || undefined,
    },
  });

  return form;
};
