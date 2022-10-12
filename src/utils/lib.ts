import dayjs from 'dayjs';
import { isSupportWebp } from '@powerfulyang/utils';

export const DateFormat = (date?: Date | string) => dayjs(date).tz('Asia/Shanghai').format('ll');

export const DateTimeFormat = (date?: Date | string) =>
  dayjs(date).tz('Asia/Shanghai').format('llll');

export const styles = {
  thumbnail: (w: number) => `&imageMogr2/thumbnail/${w}x/interlace/1/quality/100`,
  thumbnail_webp: (w: number = 300) =>
    `&imageMogr2/thumbnail/${w}x/format/webp/interlace/1/quality/100`,
  webp: '&imageMogr2/format/webp/interlace/1/quality/100',
  origin: '&imageMogr2/interlace/1/quality/100',
  thumbnail_blur: '&imageMogr2/thumbnail/10x/interlace/1/quality/1',
  thumbnail_blur_webp: '&imageMogr2/thumbnail/10x/format/webp/interlace/1/quality/1',
};

export const defaultThumbnailWidth = 300;

export const getCosObjectThumbnailUrl = (
  objectUrl: string,
  width: number = defaultThumbnailWidth,
) => `${objectUrl}${(isSupportWebp() && styles.thumbnail_webp(width)) || styles.thumbnail(width)}`;

export const getCosObjectUrl = (objectUrl: string) =>
  `${objectUrl}${(isSupportWebp() && styles.webp) || styles.origin}`;

export const getCosObjectThumbnailBlurUrl = (objectUrl: string) =>
  `${objectUrl}${(isSupportWebp() && styles.thumbnail_blur_webp) || styles.thumbnail_blur}`;

export const CosUtils = {
  getCosObjectThumbnailUrl,
  getCosObjectUrl,
  getCosObjectThumbnailBlurUrl,
} as const;

export const randomAvatar = (peerId: string) => {
  return `/api/random/avatar?uuid=${peerId}`;
};
