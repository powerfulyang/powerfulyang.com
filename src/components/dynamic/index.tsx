import dynamic from 'next/dynamic';

export const TwitterFavoriteWithNoSSR = dynamic(
  () => import('@/components/dynamic/TwitterFavorite'),
  {
    ssr: false,
  },
);

export const MapleLeafFallingWithNoSSR = dynamic(
  () => import('@/components/unSupportSSR/MapleLeafFalling'),
  { ssr: false },
);
