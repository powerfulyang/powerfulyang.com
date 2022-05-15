import type { User } from '@/type/User';
import { useQuery } from 'react-query';
import { requestAtClient } from '@/utils/client';

export const useUser = (enabled: boolean = false) => {
  const {
    isFetching,
    data: user,
    refetch,
  } = useQuery({
    queryKey: 'fetch-user',
    enabled,
    queryFn: async () => {
      try {
        const result = await requestAtClient<User>('/user/current', { notificationOnError: false });
        return result.data;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  return { isFetching, user, refetch };
};
