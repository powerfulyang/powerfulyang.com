import React, { memo, useMemo } from 'react';
import type { LazyImageProps } from '@/components/LazyImage';
import { LazyImage } from '@/components/LazyImage';
import type { Asset } from '@/__generated__/api';

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
  const image = useMemo(() => {
    if (thumbnail === 'poster') {
      return asset.objectUrl.thumbnail_700_;
    }
    if (thumbnail === 'thumbnail') {
      return asset.objectUrl.thumbnail_300_;
    }
    return asset.objectUrl.webp;
  }, [
    asset.objectUrl.thumbnail_300_,
    asset.objectUrl.thumbnail_700_,
    asset.objectUrl.webp,
    thumbnail,
  ]);
  return (
    <LazyImage
      {...props}
      width={asset.size.width}
      height={asset.size.height}
      crossOrigin="anonymous"
      aspectRatio={keepAspectRatio ? `${asset.size.width} / ${asset.size.height}` : undefined}
      src={image}
      data-src={image}
      blurSrc={asset.objectUrl.thumbnail_blur_}
      data-blur-src={asset.objectUrl.thumbnail_blur_}
    />
  );
});

LazyAssetImage.displayName = 'LazyAssetImage';
