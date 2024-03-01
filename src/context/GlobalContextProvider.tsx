import { ReactQueryProvider } from '@/context/react-query';
import { Provider as JoTaiProvider } from 'jotai';
import type { FC, PropsWithChildren } from 'react';

import { Toaster } from 'react-hot-toast';

export const GlobalContextProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <JoTaiProvider>
      <Toaster />
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </JoTaiProvider>
  );
};
