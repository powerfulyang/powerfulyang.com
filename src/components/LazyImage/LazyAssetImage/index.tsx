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
     * 压缩图片资源
     */
    thumbnail?: boolean;
    previewIndex?: number;
  }
>(({ asset, keepAspectRatio = false, thumbnail = true, previewIndex, ...props }) => {
  return (
    <LazyImage
      {...props}
      aspectRatio={keepAspectRatio ? `${asset.size.width} / ${asset.size.height}` : undefined}
      src={
        thumbnail
          ? CosUtils.getCosObjectThumbnailUrl(asset.objectUrl)
          : CosUtils.getCosObjectUrl(asset.objectUrl)
      }
      blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
    />
  );
});

LazyAssetImage.displayName = 'LazyAssetImage';
