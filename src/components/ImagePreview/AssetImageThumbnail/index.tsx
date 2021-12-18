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
    }
> = ({ asset, ...props }) => (
  <LazyImage
    {...props}
    src={CosUtils.getCosObjectThumbnailUrl(asset.objectUrl)}
    blurSrc={CosUtils.getCosObjectThumbnailBlurUrl(asset.objectUrl)}
  />
);
