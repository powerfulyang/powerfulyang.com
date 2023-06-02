import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const formatDate = (date?: Date | string) => dayjs(date).tz('Asia/Shanghai').format('ll');

export const formatDateTime = (date?: Date | string) =>
  dayjs(date).tz('Asia/Shanghai').format('llll');

export const randomAvatar = (peerId: string) => {
  return `/api/random/avatar?uuid=${peerId}`;
};
