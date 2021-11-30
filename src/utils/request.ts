import { isNil, pick, reject } from 'ramda';
import type { GetServerSidePropsContext } from 'next';
import type { SUCCESS } from '@/constant/Constant';

export type RequestOptions = {
  method?: string;
  ctx: GetServerSidePropsContext;
  body?: Record<string, any> | FormData;
  query?: Record<string, any>;
};

const stringify = (query: RequestOptions['query']) =>
  new URLSearchParams(query && reject(isNil, query)).toString();

export const request = async (url: string, options: RequestOptions) => {
  const { method = 'GET', ctx, body, query } = options;
  const baseUrl = process.env.BASE_URL;
  const headers = pick(['x-real-ip', 'cookie'], ctx.req.headers || { 'x-real-ip': '127.0.0.1' });
  const requestUrl = `${baseUrl}${url}${query ? `?${stringify(query)}` : ''}`;
  return fetch(requestUrl, {
    method,
    headers: {
      ...headers,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
};

export type ApiResponse<T = any> = {
  status: typeof SUCCESS;
  data: T;
};

export const clientRequest = async <T = any>(
  url: string,
  options: Omit<RequestOptions, 'ctx'> = {},
): Promise<ApiResponse<T>> => {
  const baseUrl = process.env.BASE_URL;
  const { method = 'GET', body, query } = options;
  const isFile = body instanceof FormData;
  const requestBody = isFile ? body : JSON.stringify(body);
  const requestHeaders = new Headers();
  if (!isFile) {
    requestHeaders.set('content-type', 'application/json');
  }
  const isValidQuery = query && Object.values(query).some((x) => !isNil(x));
  const res = await fetch(`${baseUrl}${url}${isValidQuery ? `?${stringify(query)}` : ''}`, {
    method,
    headers: requestHeaders,
    mode: 'cors',
    credentials: 'include',
    body: requestBody as BodyInit,
  });
  return res.json();
};
