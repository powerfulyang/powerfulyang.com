import type { IncomingHttpHeaders } from 'node:http';
import { pick } from 'lodash-es';

export const extractRequestHeaders = (headers: IncomingHttpHeaders) => {
  const headersToExtract = ['referer', 'authorization', 'cookie', 'user-agent'] as const;

  const extractedHeaders = pick(headers, headersToExtract) as Record<string, string>;

  const cfConnectingIp = headers['cf-connecting-ip'] as string;
  const xForwardedFor = headers['x-forwarded-for'] as string;
  return Object.assign(extractedHeaders, {
    // overwrite x-forwarded-for
    'x-forwarded-for': `${cfConnectingIp ?? ''}${xForwardedFor ? `, ${xForwardedFor}` : ''}`,
  });
};

export const checkAuthInfo = (headers: Record<string, string>) => {
  const { authorization = '', cookie = '' } = headers;
  return !!authorization || cookie.includes('authorization=');
};
