import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'jotai';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import theme from '@/theme/mui';
import { Providers } from '@/layout/Providers';

export const cache = createCache({ key: 'next' });

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster />
          <Providers>{children}</Providers>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};
