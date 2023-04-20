'use client';

import { toast } from '@powerfulyang/components';

export const customFetch: typeof fetch = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    toast.error(res.headers.get('x-error') || res.statusText);
  }
  return res;
};
