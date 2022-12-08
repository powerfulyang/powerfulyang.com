import type { User } from '@/type/User';
import { useQuery } from '@tanstack/react-query';
import { requestAtClient } from '@/utils/client';

export const useUser = (enabled: boolean = false) => {
  const {
    isFetching,
    data: user,
    refetch,
  } = useQuery({
    queryKey: ['fetch-user'],
    queryFn: async () => {
      try {
        const u = await requestAtClient<User>('/user/current', { notificationOnError: false });
        if (u.id) {
          return u;
        }
        return null;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
    enabled,
  });

  return { isFetching, user, refetch };
};
