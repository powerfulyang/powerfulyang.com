import React from 'react';
import type { AppProps } from 'next/app';
import './app.scss';
import { isClient } from '@powerfulyang/utils';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';

require('intersection-observer');

export default function App({ Component, pageProps }: AppProps) {
  if (isClient) {
    const scriptElem = document.createElement('script');
    scriptElem.src = '//at.alicdn.com/t/font_178634_m4uqhewthnm.js';
    document.body.appendChild(scriptElem);
  }
  // @ts-ignore
  const getLayout = Component.getLayout || ((page: any) => page);
  return (
    <GlobalContextProvider>
      <Header title={pageProps.title} />
      {getLayout(<Component {...pageProps} />)}
    </GlobalContextProvider>
  );
}
