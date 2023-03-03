import type { RequestOptions } from '@/utils/client';
import { stringify } from 'querystring';
import { pick } from 'ramda';

export const requestAtServer = async (url: string, options: RequestOptions = {}) => {
  const { method = 'GET', ctx, body, query, headers = {} } = options;
  const baseUrl = process.env.SERVER_BASE_URL;
  const _headers = pick(['authorization', 'x-real-ip', 'cookie'], ctx?.req.headers || headers);
  const requestUrl = `${baseUrl}${url}${query ? `?${stringify(query)}` : ''}`;
  return fetch(requestUrl, {
    method,
    headers: _headers,
    body: JSON.stringify(body),
  });
};
