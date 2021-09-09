import dynamic from 'next/dynamic';

/**
 * @deprecated
 */
export const MapleLeafFallingWithNoSSR = dynamic(
  () => import('@/deprecated/unSupportSSR/MapleLeafFalling'),
  { ssr: false },
);
