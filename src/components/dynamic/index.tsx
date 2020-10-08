import dynamic from 'next/dynamic';

export const TwitterFavoriteWithNoSSR = dynamic(
  () => import('@/components/dynamic/useTwitterFavorite'),
  {
    ssr: false,
  },
);
