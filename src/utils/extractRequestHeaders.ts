import type { IncomingHttpHeaders } from 'node:http';
import { pick } from 'lodash-es';

export const extractRequestHeaders = (headers: IncomingHttpHeaders) => {
  const headersToExtract = [
    'referer',
    'authorization',
    'x-real-ip',
    'cookie',
    'user-agent',
    'x-forwarded-for',
  ] as const;

  return pick(headers, headersToExtract) as HeadersInit;
};
