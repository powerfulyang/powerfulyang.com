'use client';

import { toast } from 'react-hot-toast';

export const customFetch: typeof fetch = async (...params) => {
  const res = await fetch(...params);
  if (!res.ok) {
    const error = await res.json();
    toast.error(error.message);
  }
  return res;
};
