import React from 'react';
import type { AppProps } from 'next/app';
import './app.scss';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';

type Props = {
  Component: AppProps['Component'] & { getLayout: any };
};

const App = ({ Component, pageProps }: AppProps & Props) => {
  const getLayout = Component.getLayout || ((page: typeof Component) => page);
  return (
    <GlobalContextProvider>
      <Header title={pageProps.title} />
      {getLayout(<Component {...pageProps} />)}
    </GlobalContextProvider>
  );
};

export default App;
