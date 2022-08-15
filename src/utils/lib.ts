import dayjs from 'dayjs';
import { isSupportWebp } from '@powerfulyang/utils';

export const DateFormat = (date?: Date | string) => dayjs(date).format('ll');

export const DateTimeFormat = (date?: Date | string) => dayjs(date).format('llll');

export const TimeFormat = () => dayjs().format('HH:mm:ss');

export const styles = {
  thumbnail: '&imageMogr2/thumbnail/300x/interlace/1/quality/90',
  thumbnail_webp: '&imageMogr2/thumbnail/300x/format/webp/interlace/1/quality/90',
  webp: '&imageMogr2/format/webp/interlace/1/quality/100',
  origin: '&imageMogr2/interlace/1/quality/100',
  thumbnail_blur: '&imageMogr2/thumbnail/10x/interlace/1/quality/1',
  thumbnail_blur_webp: '&imageMogr2/thumbnail/10x/format/webp/interlace/1/quality/1',
};

export const getCosObjectThumbnailUrl = (objectUrl?: string) =>
  objectUrl && `${objectUrl}${(isSupportWebp() && styles.thumbnail_webp) || styles.thumbnail}`;

export const getCosObjectUrl = (objectUrl?: string) =>
  objectUrl && `${objectUrl}${(isSupportWebp() && styles.webp) || styles.origin}`;

export const getCosObjectThumbnailBlurUrl = (objectUrl?: string) =>
  objectUrl &&
  `${objectUrl}${(isSupportWebp() && styles.thumbnail_blur_webp) || styles.thumbnail_blur}`;

export const CosUtils = {
  getCosObjectThumbnailUrl,
  getCosObjectUrl,
  getCosObjectThumbnailBlurUrl,
} as const;

export const randomAvatar = (peerId: string) => {
  return `/api/random/avatar?uuid=${peerId}`;
};
