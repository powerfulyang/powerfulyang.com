import fetch from 'node-fetch';
import { pick } from 'ramda';
import { GetServerSidePropsContext } from 'next';

export type RequestOptions = {
  method?: string;
  ctx?: GetServerSidePropsContext;
};

export const request = async (url: string, options: RequestOptions = {}) => {
  const { method = 'GET', ctx } = options;
  const baseUrl = process.env.BASE_URL;
  const headers = pick(['x-real-ip', 'cookie'], ctx?.req.headers || { 'x-real-ip': '127.0.0.1' });
  console.log(headers);
  return fetch(`${baseUrl}${url}`, {
    method,
    headers,
  });
};
