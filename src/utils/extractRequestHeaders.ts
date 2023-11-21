import type { IncomingHttpHeaders } from 'node:http';
import { pick } from 'lodash-es';
import type { headers as _headers } from 'next/headers';

export const extractRequestHeaders = (
  headers: IncomingHttpHeaders | ReturnType<typeof _headers>,
) => {
  const headersToExtract = [
    'referer',
    'authorization',
    'cookie',
    'user-agent',
    'x-forwarded-for',
    'cf-connecting-ip',
  ] as const;

  if ('get' in headers) {
    const _res = {};
    headersToExtract.forEach((key) => {
      // @ts-ignore
      _res[key] = headers.get(key);
    });
    return _res;
  }

  return pick(headers, headersToExtract);
};

export const checkAuthInfo = (headers: IncomingHttpHeaders | ReturnType<typeof _headers>) => {
  const { authorization = '', cookie = '' } = extractRequestHeaders(headers) as {
    authorization: string;
    cookie: string;
  };
  return !!authorization || cookie.includes('authorization=');
};
