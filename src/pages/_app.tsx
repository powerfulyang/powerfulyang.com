import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import './app.scss';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';

type Props = {
  Component: AppProps['Component'] & { getLayout: any };
};

const App = ({ Component, pageProps }: AppProps & Props) => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...rest: any[]) {
      window.dataLayer.push(rest);
    }
    gtag('js', new Date());

    gtag('config', 'G-T622M0KSVS');
  }, []);
  const getLayout = Component.getLayout || ((page: typeof Component) => page);
  return (
    <GlobalContextProvider>
      <Header title={pageProps.title} />
      {getLayout(<Component {...pageProps} />)}
    </GlobalContextProvider>
  );
};

export default App;
