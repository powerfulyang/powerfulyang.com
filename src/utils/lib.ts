import dayjs from 'dayjs';

export const DateFormat = (date?: Date | string) => dayjs(date).tz('Asia/Shanghai').format('ll');

export const DateTimeFormat = (date?: Date | string) =>
  dayjs(date).tz('Asia/Shanghai').format('llll');

export const randomAvatar = (peerId: string) => {
  return `/api/random/avatar?uuid=${peerId}`;
};
