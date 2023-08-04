import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'jotai';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme/mui';

export const cache = createCache({ key: 'next' });

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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster />
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};
