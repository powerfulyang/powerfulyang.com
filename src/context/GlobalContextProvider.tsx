import { Provider } from 'jotai';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/layout/Providers';

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <Toaster />
      <Providers>{children}</Providers>
    </Provider>
  );
};
