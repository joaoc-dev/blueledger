import { getUser } from '@/services/users/users';
import { useQuery } from '@tanstack/react-query';

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: getUser,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
