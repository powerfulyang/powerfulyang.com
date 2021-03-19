import React from 'react';
import { AppProps } from 'next/app';
import './app.scss';
import { isClient } from '@powerfulyang/utils';

export default function App({ Component, pageProps }: AppProps) {
  if (isClient) {
    const scriptElem = document.createElement('script');
    scriptElem.src = '//at.alicdn.com/t/font_178634_gplar6cu12.js';
    document.body.appendChild(scriptElem);
  }
  return <Component {...pageProps} />;
}
