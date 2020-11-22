import { GetServerSideProps } from 'next';
import { request } from '@/utils/request';
import { RequestOptions } from '@/types/RequestOptions';
import { ParsedUrlQuery } from 'querystring';
import dayjs from 'dayjs';

export const initialProps = <T extends ParsedUrlQuery = ParsedUrlQuery>(
  url: string,
  options: RequestOptions = {},
): GetServerSideProps<T> => {
  return async (ctx) => {
    const response = await request(url, { ...options, ctx });
    const data = await response.json();
    return {
      props: data,
    };
  };
};

export const DateFormat = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};
