import { ReactQueryProvider } from '@/context/react-query';
import { Provider } from 'jotai';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <Toaster />
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </Provider>
  );
};
