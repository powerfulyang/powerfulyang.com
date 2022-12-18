import dayjs from 'dayjs';
import { isSupportWebp } from '@powerfulyang/utils';

export const DateFormat = (date?: Date | string) => dayjs(date).tz('Asia/Shanghai').format('ll');

export const DateTimeFormat = (date?: Date | string) =>
  dayjs(date).tz('Asia/Shanghai').format('llll');

export const styles = {
  thumbnail: (w: number) => `&imageMogr2/thumbnail/${w}x/interlace/1/quality/100/ignore-error/1`,
  thumbnail_webp: (w: number = 300) =>
    `&imageMogr2/thumbnail/${w}x/format/webp/interlace/1/quality/100/ignore-error/1`,
  webp: '&imageMogr2/format/webp/interlace/1/quality/100/ignore-error/1',
  origin: '&imageMogr2/interlace/1/quality/100/ignore-error/1',
  thumbnail_blur: '&imageMogr2/thumbnail/10x/interlace/1/quality/1/ignore-error/1',
  thumbnail_blur_webp: '&imageMogr2/thumbnail/10x/format/webp/interlace/1/quality/1/ignore-error/1',
};

export const defaultThumbnailWidth = 300;

export const getExtname = (url: string) => {
  const u = new URL(url);

  const extname = u.pathname.split('.').pop();
  if (extname) {
    return extname;
  }

  return '';
};

export const isGif = (url: string) => {
  const extname = getExtname(url);
  return extname === 'gif';
};

export const getCosObjectThumbnailUrl = (
  objectUrl: string,
  width: number = defaultThumbnailWidth,
) => {
  if (isSupportWebp()) {
    return `${objectUrl}${styles.thumbnail_webp(width)}`;
  }

  return `${objectUrl}${styles.thumbnail(width)}`;
};

export const getCosObjectUrl = (objectUrl: string) => {
  if (isSupportWebp()) {
    return `${objectUrl}${styles.webp}`;
  }

  return `${objectUrl}${styles.origin}`;
};

export const getCosObjectThumbnailBlurUrl = (objectUrl: string) => {
  if (isSupportWebp()) {
    return `${objectUrl}${styles.thumbnail_blur_webp}`;
  }

  return `${objectUrl}${styles.thumbnail_blur}`;
};

export const CosUtils = {
  getCosObjectThumbnailUrl,
  getCosObjectUrl,
  getCosObjectThumbnailBlurUrl,
} as const;

export const randomAvatar = (peerId: string) => {
  return `/api/random/avatar?uuid=${peerId}`;
};
