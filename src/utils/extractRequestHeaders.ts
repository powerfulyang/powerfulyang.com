import type { IncomingHttpHeaders } from 'node:http';
import { pick } from 'lodash-es';
import type { headers as _headers } from 'next/headers';

export const extractRequestHeaders = (
  headers: IncomingHttpHeaders | ReturnType<typeof _headers>,
) => {
  const headersToExtract = [
    'referer',
    'authorization',
    'x-real-ip',
    'cookie',
    'user-agent',
    'x-forwarded-for',
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
