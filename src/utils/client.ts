import { isNil } from 'ramda';
import type { GetServerSideProps } from 'next';
import { notification } from '@powerfulyang/components';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { stringify } from 'querystring';

export type RequestOptions = {
  method?: string;
  ctx: Parameters<GetServerSideProps>[0];
  body?: Record<string, any> | FormData;
  query?: Record<string, any>;
  notificationOnError?: boolean;
};

export const requestAtClient = async <T = any>(
  url: string,
  options: Omit<RequestOptions, 'ctx'> = {},
): Promise<T> => {
  const host = process.env.CLIENT_BASE_HOST;

  let baseUrl = '';
  let mode: RequestMode = 'same-origin';
  const { origin: currentOrigin, host: currentHost } = window.location;
  if (url.startsWith('https://')) {
    const { origin } = new URL(url);
    if (currentOrigin !== origin) {
      mode = 'cors';
    }
  } else if (host) {
    baseUrl = `//${host}/api`;
    if (currentHost !== host) {
      mode = 'cors';
    }
  } else {
    baseUrl = `/api`;
  }

  const { method = 'GET', query, body, notificationOnError = true } = options;
  let requestBody;
  const headers = new Headers();
  if (body) {
    if (body instanceof FormData) {
      requestBody = body;
    } else {
      headers.set('content-type', 'application/json');
      requestBody = JSON.stringify(body);
    }
  }

  const isValidQuery = query && Object.values(query).some((x) => !isNil(x));
  const queryString = isValidQuery ? `?${stringify(query)}` : '';
  const requestUrl = `${baseUrl}${url}${queryString}`;

  const res = await fetch(requestUrl, {
    method,
    headers,
    mode,
    credentials: 'include',
    body: requestBody,
  });

  if (res.status >= 300) {
    const message = res.headers.get('x-error') || getReasonPhrase(res.status);

    if (notificationOnError) {
      notification.error({
        message: `请求错误: ${res.status}`,
        description: message,
      });
    }

    if (res.status === StatusCodes.INTERNAL_SERVER_ERROR) {
      const json = await res.json();
      throw new Error(json.message);
    }

    throw new Error(message); // 请求异常走 onError 回调
  }

  if (res.status === StatusCodes.NO_CONTENT) {
    return null as T;
  }

  return res.json();
};
