import type { FC } from 'react';
import React from 'react';
import classNames from 'classnames';
import { LazyImage } from '@/components/LazyImage';
import type { Asset } from '@/type/Asset';
import { CosUtils } from '@/utils/lib';

export const ImageThumbnailWrap: FC<{
  asset: Asset;
  inViewAction?: (id?: number) => void;
  onClick?: () => void;
  className?: string;
}> = ({ asset, inViewAction, onClick, className }) => (
  <LazyImage
    className={classNames(className)}
    src={CosUtils.getCosObjectThumbnailUrl(asset.objectUrl)}
    blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
    assetId={asset.id}
    inViewAction={(id) => {
      inViewAction?.(id);
    }}
    onClick={onClick}
  />
);
