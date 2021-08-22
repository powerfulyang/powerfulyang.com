import dayjs from 'dayjs';
import { isSupportWebp } from '@powerfulyang/utils';

export const DateFormat = (date?: Date) => {
  return dayjs(date).format('ll');
};

export const DateTimeFormat = (date?: Date) => {
  return dayjs(date).format('llll');
};

export const TimeFormat = () => {
  return dayjs().format('HHmmss');
};

export const styles = {
  thumbnail: '&imageMogr2/thumbnail/300x/interlace/1',
  thumbnail_webp: '&imageMogr2/thumbnail/300x/format/webp/interlace/1/quality/100',
  webp: '&imageMogr2/format/webp/interlace/1/quality/100',
  origin: '',
};

export const getCosObjectThumbnailUrl = (objectUrl?: string) => {
  return (
    objectUrl && `${objectUrl}${(isSupportWebp() && styles.thumbnail_webp) || styles.thumbnail}`
  );
};

export const getCosObjectUrl = (objectUrl?: string) => {
  return objectUrl && `${objectUrl}${(isSupportWebp() && styles.webp) || styles.origin}`;
};

export const CosUtils = {
  getCosObjectThumbnailUrl,
  getCosObjectUrl,
} as const;
