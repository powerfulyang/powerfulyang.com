import React, { FC, useEffect, useState } from 'react';
import { LazyImage } from '@/components/LazyImage';
import { Asset } from '@/types/Asset';
import { CosUtils } from '@/utils/lib';
import styles from './index.module.scss';

export const ImageThumbnailWrap: FC<{
  asset: Asset;
  inViewAction?: (id?: number) => void;
  onClick?: () => void;
}> = ({ asset, inViewAction, onClick }) => {
  const [data, setData] = useState({ src: '', blurSrc: '' });

  useEffect(() => {
    setData({
      src: CosUtils.getCosObjectThumbnailUrl(asset.objectUrl)!,
      blurSrc: CosUtils.getCosObjectBlurUrl(asset.objectUrl)!,
    });
  }, [asset.objectUrl]);
  return (
    <div className={styles.image_wrap} onClick={onClick}>
      <LazyImage
        className={styles.image}
        src={data.src}
        blurSrc={data.blurSrc}
        assetId={asset.id}
        inViewAction={(id) => {
          inViewAction?.(id);
        }}
      />
    </div>
  );
};
