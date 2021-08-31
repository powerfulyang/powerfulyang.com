import { LazyImage } from '@/components/LazyImage';
import React, { FC } from 'react';
import { Asset } from '@/types/Asset';
import styles from './index.module.scss';

export const ImageThumbnailWrap: FC<{
  asset: Asset;
  inViewAction?: (id?: number) => void;
  onClick?: () => void;
}> = ({ asset, inViewAction, onClick }) => {
  return (
    <div className={styles.image_wrap} onClick={onClick}>
      <LazyImage
        className={styles.image}
        src={asset.objectUrl}
        assetId={asset.id}
        inViewAction={(id) => {
          inViewAction?.(id);
        }}
      />
    </div>
  );
};
