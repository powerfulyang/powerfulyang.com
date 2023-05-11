'use client';

import { toast } from 'react-hot-toast';

export const customFetch: typeof fetch = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    toast.error(error.message);
  }
  return res;
};
