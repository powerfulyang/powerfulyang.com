import { RequestOptions } from '@/types/RequestOptions';
import fetch from 'node-fetch';
import { pick } from 'ramda';

export const request = async (url: string, options: RequestOptions) => {
  const { method = 'GET', ctx, pathVariable } = options;
  const baseUrl = process.env.BASE_URL;
  let path = '';
  if (pathVariable) {
    path = pathVariable(ctx!);
  }
  return fetch(`${baseUrl}${url}${path}`, {
    method,
    headers: pick(['x-real-ip'], ctx?.req.headers),
  });
};
