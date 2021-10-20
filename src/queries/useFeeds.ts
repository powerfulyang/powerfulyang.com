import { useQuery } from 'react-query';
import { clientRequest } from '@/utils/request';
import { Feed } from '@/type/Feed';

export const useFeeds = (sourceFeeds: Feed[]) => {
  const { data: feeds } = useQuery(
    useFeeds.name,
    async () => {
      const { data } = await clientRequest<Feed[]>('/public/feed');
      return data;
    },
    { initialData: sourceFeeds },
  );
  return feeds;
};
