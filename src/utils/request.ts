import nodeFetch from 'node-fetch';
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
  return nodeFetch(`${baseUrl}${url}`, {
    method,
    headers,
  });
};

export const swrRequest = (options: RequestOptions = {}) => {
  const baseUrl = 'https://api.powerfulyang.com/api';
  const { method } = options;
  return async (url: any) => {
    const res = await fetch(`${baseUrl}${url}`, {
      method,
      mode: 'cors',
      credentials: 'include',
    });
    const json = await res.json();
    const { data } = json;
    return data;
  };
};
