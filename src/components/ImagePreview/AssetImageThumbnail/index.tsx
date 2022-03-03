import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';
import React from 'react';
import type { MotionProps } from 'framer-motion';
import type { LazyImageExtendProps } from '@/components/LazyImage';
import { LazyImage } from '@/components/LazyImage';
import type { Asset } from '@/type/Asset';
import { CosUtils } from '@/utils/lib';

export const AssetImageThumbnail: FC<
  DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
    LazyImageExtendProps &
    MotionProps & {
      asset: Asset;
      keepAspectRatio?: boolean;
      /**
       * 压缩图片资源
       */
      thumbnail?: boolean;
    }
> = ({ asset, style, keepAspectRatio, thumbnail, ...props }) => (
  <LazyImage
    {...props}
    style={{
      ...(keepAspectRatio ? { aspectRatio: `${asset?.size.width} / ${asset?.size.height}` } : {}),
      ...style,
    }}
    src={
      thumbnail
        ? CosUtils.getCosObjectThumbnailUrl(asset?.objectUrl)
        : CosUtils.getCosObjectUrl(asset?.objectUrl)
    }
    blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset?.objectUrl)}
  />
);
