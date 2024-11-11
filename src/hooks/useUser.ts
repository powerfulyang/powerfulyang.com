'use client';

import {clientApi} from '@/request/requestTool';
import {useQuery} from '@tanstack/react-query';

export const useUser = (enabled: boolean = false) => {
  const {
    isFetching,
    data: user,
    refetch,
  } = useQuery({
    queryKey: ['fetch-user'],
    queryFn: async () => {
      const u = await clientApi.queryCurrentUser();
      return u.data;
    },
    retry: false,
    refetchOnWindowFocus: true,
    enabled,
  });

  return {isFetching, user, refetch};
};
