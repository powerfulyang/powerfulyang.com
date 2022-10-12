import React, { memo } from 'react';
import type { LazyImageProps } from '@/components/LazyImage';
import { LazyImage } from '@/components/LazyImage';
import type { Asset } from '@/type/Asset';
import { CosUtils, defaultThumbnailWidth } from '@/utils/lib';

export const LazyAssetImage = memo<
  LazyImageProps & {
    asset: Asset;
    keepAspectRatio?: boolean;
    /**
     * 图片尺寸
     */
    thumbnail?: number | false;
    previewIndex?: number;
  }
>(
  ({
    asset,
    keepAspectRatio = false,
    thumbnail = defaultThumbnailWidth,
    previewIndex,
    ...props
  }) => {
    return (
      <LazyImage
        {...props}
        aspectRatio={keepAspectRatio ? `${asset.size.width} / ${asset.size.height}` : undefined}
        src={
          thumbnail
            ? CosUtils.getCosObjectThumbnailUrl(asset.objectUrl, thumbnail)
            : CosUtils.getCosObjectUrl(asset.objectUrl)
        }
        blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
      />
    );
  },
);

LazyAssetImage.displayName = 'LazyAssetImage';
