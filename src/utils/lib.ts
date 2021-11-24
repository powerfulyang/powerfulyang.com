import dayjs from 'dayjs';
import { isSupportWebp } from '@powerfulyang/utils';

export const DateFormat = (date?: Date) => dayjs(date).format('ll');

export const DateTimeFormat = (date?: Date) => dayjs(date).format('llll');

export const TimeFormat = () => dayjs().format('HH:mm:ss');

export const styles = {
  thumbnail: '&imageMogr2/thumbnail/interlace/1/quality/30',
  thumbnail_webp: '&imageMogr2/thumbnail/format/webp/interlace/1/quality/30',
  webp: '&imageMogr2/format/webp/interlace/1/quality/100',
  origin: '',
  blur: '&imageMogr2/interlace/1/quality/1',
  blur_webp: '&imageMogr2/format/webp/interlace/1/quality/1',
  thumbnail_blur: '&imageMogr2/thumbnail/interlace/1/quality/1',
  thumbnail_blur_webp: '&imageMogr2/thumbnail/format/webp/interlace/1/quality/1',
};

export const getCosObjectBlurUrl = (objectUrl?: string) =>
  objectUrl && `${objectUrl}${(isSupportWebp() && styles.blur_webp) || styles.blur}`;

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
  getCosObjectBlurUrl,
  getCosObjectThumbnailBlurUrl,
} as const;
