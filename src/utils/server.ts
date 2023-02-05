import { pick } from 'ramda';
import type { RequestOptions } from '@/utils/client';
import { stringify } from 'querystring';

export const requestAtServer = async (url: string, options: RequestOptions) => {
  const { method = 'GET', ctx, body, query } = options;
  const baseUrl = process.env.SERVER_BASE_URL;
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
