import React from 'react';
import { AppProps } from 'next/app';
import './app.scss';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
