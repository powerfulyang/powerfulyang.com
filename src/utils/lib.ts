import dayjs from 'dayjs';

export const DateFormat = (date: Date) => {
  return dayjs(date).format('LL');
};
