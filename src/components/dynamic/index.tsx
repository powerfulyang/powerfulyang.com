import dynamic from 'next/dynamic';

/**
 * @deprecated
 */
export const MapleLeafFallingWithNoSSR = dynamic(
  () => import('@/deprecated/unSupportSSR/MapleLeafFalling'),
  { ssr: false },
);

export const TwitterFav = dynamic(() => import('@/deprecated/unSupportSSR/mo-js/TwitterFav'), {
  ssr: false,
});

export const FireworksAnimate = dynamic(() => import('@/deprecated/unSupportSSR/mo-js/fireworks'), {
  ssr: false,
});
