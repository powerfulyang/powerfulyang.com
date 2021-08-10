import nodeFetch from 'node-fetch';
import { pick } from 'ramda';
import { GetServerSidePropsContext } from 'next';
import { stringify } from 'querystring';

export type RequestOptions = {
  method?: string;
  ctx: GetServerSidePropsContext;
  body?: Record<string, any>;
  query?: Record<string, any>;
};

export const request = async (url: string, options: RequestOptions) => {
  const { method = 'GET', ctx, body, query } = options;
  const baseUrl = process.env.BASE_URL;
  const headers = pick(['x-real-ip', 'cookie'], ctx.req.headers || { 'x-real-ip': '127.0.0.1' });
  return nodeFetch(`${baseUrl}${url}${query ? `?${stringify(query)}` : ''}`, {
    method,
    headers,
    body: JSON.stringify(body),
  });
};

export const swrRequest = (options: Omit<RequestOptions, 'ctx'> = {}) => {
  const baseUrl = 'https://api.powerfulyang.com/api';
  const { method = 'GET' } = options;
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
