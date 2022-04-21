import { isNil, reject } from 'ramda';
import type { GetServerSideProps } from 'next';
import { notification } from '@powerfulyang/components';

export type RequestOptions = {
  method?: string;
  ctx: Parameters<GetServerSideProps>[0];
  body?: Record<string, any> | FormData;
  query?: Record<string, any>;
};

export const stringify = (query: RequestOptions['query']) =>
  new URLSearchParams(query && reject(isNil, query)).toString();

export type ApiResponse<T = any> = {
  data: T;
  pathViewCount: number;
  message: string;
};

export const requestAtClient = async <T = any>(
  url: string,
  options: Omit<RequestOptions, 'ctx'> = {},
): Promise<ApiResponse<T>> => {
  const host = process.env.CLIENT_BASE_HOST;
  const baseUrl = `${host ? `//${host}` : ''}/api`;
  const { method = 'GET', body, query } = options;
  const isFormData = body instanceof FormData;
  const requestBody = isFormData ? body : JSON.stringify(body);
  const requestHeaders = new Headers();
  if (!isFormData) {
    requestHeaders.set('content-type', 'application/json');
  }
  const isValidQuery = query && Object.values(query).some((x) => !isNil(x));
  const res = await fetch(`${baseUrl}${url}${isValidQuery ? `?${stringify(query)}` : ''}`, {
    method,
    headers: requestHeaders,
    mode: 'cors',
    credentials: 'include',
    body: requestBody as BodyInit,
  });
  const json = await res.json();
  if (res.status >= 300) {
    notification.error({
      message: `请求错误：${res.status}`,
      description: json.message,
    });
    throw new Error(json.message); // 请求异常走 onError 回调，但是问题会拿不到错误详情。
  }
  return json;
};
