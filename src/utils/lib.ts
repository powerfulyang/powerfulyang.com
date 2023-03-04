import dayjs from 'dayjs';

export const DateFormat = (date?: Date | string) => dayjs(date).tz('Asia/Shanghai').format('ll');

export const DateTimeFormat = (date?: Date | string) =>
  dayjs(date).tz('Asia/Shanghai').format('llll');

export const styles = {
  thumbnail_700_: `-thumbnail(700)`,
  thumbnail_300_: `-thumbnail(300)`,
  webp: '-webp',
  thumbnail_blur_: '-thumbnail(blur)',
};

export const getCosObjectThumbnailUrl = (
  objectUrl: string,
  thumbnail: 'poster' | 'thumbnail' = 'thumbnail',
) => {
  const [url, params] = objectUrl.split('?');
  if (thumbnail === 'poster') {
    return `${url}${styles.thumbnail_700_}?${params}`;
  }
  return `${url}${styles.thumbnail_300_}?${params}`;
};

export const getCosObjectUrl = (objectUrl: string) => {
  const [url, params] = objectUrl.split('?');
  return `${url}${styles.webp}?${params}`;
};

export const getCosObjectThumbnailBlurUrl = (objectUrl: string) => {
  const [url, params] = objectUrl.split('?');
  return `${url}${styles.thumbnail_blur_}?${params}`;
};

export const CosUtils = {
  getCosObjectThumbnailUrl,
  getCosObjectUrl,
  getCosObjectThumbnailBlurUrl,
} as const;

export const randomAvatar = (peerId: string) => {
  return `/api/random/avatar?uuid=${peerId}`;
};
