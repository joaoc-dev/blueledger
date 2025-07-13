import { useQuery } from '@tanstack/react-query';

const fetchUser = async () => {
  const res = await fetch('/api/users/me');
  if (!res.ok) throw new Error('Failed to fetch user info');
  return res.json();
};

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUser,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
