import { useQuery } from 'react-query';
import { clientRequest } from '@/utils/request';
import type { Feed } from '@/type/Feed';

export const useFeeds = (sourceFeeds: Feed[]) => {
  const { data: feeds, isFetching } = useQuery(
    useFeeds.name,
    async () => {
      const { data } = await clientRequest<Feed[]>('/public/feed');
      return data;
    },
    { initialData: sourceFeeds },
  );
  return [isFetching, feeds] as const;
};
