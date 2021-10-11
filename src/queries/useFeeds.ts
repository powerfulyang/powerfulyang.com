import useSWR from 'swr';
import { clientRequest } from '@/utils/request';
import { Feed } from '@/types/Feed';

export const useFeeds = (sourceFeeds: Feed[]) => {
  const { data: feeds } = useSWR(
    useFeeds.name,
    async () => {
      const { data } = await clientRequest<Feed[]>('/public/feed');
      return data;
    },
    { fallbackData: sourceFeeds },
  );
  return feeds;
};
