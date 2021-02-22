import dynamic from 'next/dynamic';

/**
 * @deprecated
 */
export const TwitterFavoriteWithNoSSR = dynamic(
  () => import('@/components/dynamic/TwitterFavorite'),
  {
    ssr: false,
  },
);

/**
 * @deprecated
 */
export const MapleLeafFallingWithNoSSR = dynamic(
  () => import('@/deprecated/unSupportSSR/MapleLeafFalling'),
  { ssr: false },
);

export const TagCloudWithNoSSR = dynamic(() => import('./TagCloud'), { ssr: false });
