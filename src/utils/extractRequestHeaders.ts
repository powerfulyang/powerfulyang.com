import { pick } from 'ramda';
import type { IncomingHttpHeaders } from 'node:http';

export const extractRequestHeaders = (headers: IncomingHttpHeaders) => {
  const headersToExtract = [
    'referer',
    'authorization',
    'x-real-ip',
    'cookie',
    'user-agent',
    'x-forwarded-for',
  ] as const;

  return pick(headersToExtract, headers);
};
