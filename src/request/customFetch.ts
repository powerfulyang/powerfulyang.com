'use client';

import { notification } from '@powerfulyang/components';

export const customFetch: typeof fetch = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    notification.error({
      message: 'Error',
      // @ts-ignore
      description: res.headers.get('x-error') || res.statusText,
    });
  }
  return res;
};
