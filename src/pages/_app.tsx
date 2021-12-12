import React from 'react';
import type { AppProps } from 'next/app';
import './app.scss';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';

require('intersection-observer');

const App = ({ Component, pageProps }: AppProps) => {
  // @ts-ignore
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <GlobalContextProvider>
      <Header title={pageProps.title} />
      {getLayout(<Component {...pageProps} />)}
    </GlobalContextProvider>
  );
};

export default App;
