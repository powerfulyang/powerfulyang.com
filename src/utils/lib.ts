import dayjs from 'dayjs';

export const DateFormat = (date?: Date) => {
  return dayjs(date).format('ll');
};

export const DateTimeFormat = (date?: Date) => {
  return dayjs(date).format('llll');
};
