import React, { memo } from 'react';
import type { LazyImageProps } from '@/components/LazyImage';
import { LazyImage } from '@/components/LazyImage';
import type { Asset } from '@/type/Asset';
import { CosUtils } from '@/utils/lib';

export const LazyAssetImage = memo<
  LazyImageProps & {
    asset: Asset;
    keepAspectRatio?: boolean;
    /**
     * 图片尺寸
     */
    thumbnail?: 'poster' | 'thumbnail';
    previewIndex?: number;
  }
>(({ asset, keepAspectRatio = false, thumbnail, previewIndex, ...props }) => {
  return (
    <LazyImage
      {...props}
      width={asset.size.width}
      height={asset.size.height}
      crossOrigin="anonymous"
      aspectRatio={keepAspectRatio ? `${asset.size.width} / ${asset.size.height}` : undefined}
      src={
        thumbnail
          ? CosUtils.getCosObjectThumbnailUrl(asset.objectUrl, thumbnail)
          : CosUtils.getCosObjectUrl(asset.objectUrl)
      }
      blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
    />
  );
});

LazyAssetImage.displayName = 'LazyAssetImage';
