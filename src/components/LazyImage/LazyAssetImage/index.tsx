import React, { memo } from 'react';
import { equals } from 'ramda';
import type { LazyImageProps } from '@/components/LazyImage';
import { LazyImage } from '@/components/LazyImage';
import type { Asset } from '@/type/Asset';
import { CosUtils } from '@/utils/lib';

export const LazyAssetImage = memo<
  Omit<LazyImageProps, 'inViewCallback'> & {
    asset: Asset;
    keepAspectRatio?: boolean;
    /**
     * 压缩图片资源
     */
    thumbnail?: boolean;
    inViewCallback?: (assetId: number) => void;
  }
>(
  ({
    asset,
    style,
    keepAspectRatio = false,
    thumbnail = true,
    inViewCallback,
    draggable = false,
    ...props
  }) => {
    return (
      <LazyImage
        {...props}
        draggable={draggable}
        style={{
          ...(keepAspectRatio
            ? { aspectRatio: `${asset?.size.width} / ${asset?.size.height}` }
            : {}),
          ...style,
        }}
        src={
          thumbnail
            ? CosUtils.getCosObjectThumbnailUrl(asset?.objectUrl)
            : CosUtils.getCosObjectUrl(asset?.objectUrl)
        }
        blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset?.objectUrl)}
        inViewCallback={() => {
          inViewCallback?.(asset?.id);
        }}
      />
    );
  },
  (prevProps, nextProps) => {
    return equals(prevProps.asset.id, nextProps.asset.id);
  },
);

LazyAssetImage.displayName = 'LazyAssetImage';
