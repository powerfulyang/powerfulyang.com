import { RequestOptions } from '@/types/RequestOptions';
import fetch from 'node-fetch';

export const request = async (url: string, options: RequestOptions) => {
  const { method = 'GET', ctx, pathVariable } = options;
  const baseUrl = process.env.BASE_URL;
  let path = '';
  if (pathVariable) {
    path = pathVariable(ctx!);
  }
  return fetch(`${baseUrl}${url}${path}`, {
    method,
    headers: <any>ctx?.req.headers,
  });
};
