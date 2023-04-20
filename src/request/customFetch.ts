'use client';

export const customFetch: typeof fetch = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    // todo handle error
  }
  return res;
};
