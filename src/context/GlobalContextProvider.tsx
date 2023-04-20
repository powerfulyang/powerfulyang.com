import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

const cache = createCache({ key: 'next' });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: Infinity,
    },
  },
});

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <CacheProvider value={cache}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </CacheProvider>
    </Provider>
  );
};
