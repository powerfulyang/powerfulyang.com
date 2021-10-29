import type { FC } from 'react';
import React from 'react';
import { LazyImage } from '@/components/LazyImage';
import type { Asset } from '@/type/Asset';
import { CosUtils } from '@/utils/lib';
import styles from './index.module.scss';

export const ImageThumbnailWrap: FC<{
  asset: Asset;
  inViewAction?: (id?: number) => void;
  onClick?: () => void;
}> = ({ asset, inViewAction, onClick }) => (
  <button type="button" className={styles.image_wrap} onClick={onClick}>
    <LazyImage
      className={styles.image}
      src={CosUtils.getCosObjectThumbnailUrl(asset.objectUrl)}
      blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
      assetId={asset.id}
      inViewAction={(id) => {
        inViewAction?.(id);
      }}
    />
  </button>
);
