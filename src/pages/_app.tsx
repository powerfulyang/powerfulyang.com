import { GlobalHooks } from '@/components/GlobalHooks';
import { Header, origin } from '@/components/Head';
import { RouteChangeAnimation } from '@/components/RouteChangeAnimation';
import { ProjectName } from '@/constant/Constant';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { usePV } from '@/hooks/usePV';
import _404 from '@/pages/404';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import React, { useMemo } from 'react';
import 'reflect-metadata';
import './app.scss';

import('@/three/extend');

interface HeaderProps {
  meta?: {
    title: string;
    description: string;
    noindex: boolean;
    nofollow: boolean;
  };
  link?: {
    canonical: string;
  };
}

export type MyAppProps = {
  Component: AppProps['Component'] & { getLayout: any };
  pageProps: {
    [key: string]: any;
  } & HeaderProps;
} & AppProps;

const App = ({ Component, pageProps }: MyAppProps) => {
  const { getLayout } = Component;
  // @ts-ignore
  const notFound = Component === _404;

  const component = useMemo(() => {
    if (getLayout) {
      return getLayout(<Component {...pageProps} />);
    }
    return <Component {...pageProps} />;
  }, [Component, getLayout, pageProps]);

  // 路由变化时，PV统计
  const pv = usePV();

  const {
    title = '404',
    description,
    noindex = notFound,
    nofollow = notFound,
  } = (pageProps.meta as HeaderProps['meta']) || {};
  const { canonical } = (pageProps.link as HeaderProps['link']) || {};
  const _title = `${title} - ${ProjectName}`;

  return (
    <GlobalContextProvider>
      <NextSeo
        title={_title}
        description={description}
        canonical={canonical}
        noindex={noindex}
        nofollow={nofollow}
        openGraph={{
          url: canonical,
          title: _title,
          description,
          images: [
            {
              url: `${origin}/icons/android-chrome-192x192.png`,
              width: 192,
              height: 192,
              alt: 'Og Image Alt',
              type: 'image/png',
            },
          ],
          siteName: ProjectName,
        }}
        twitter={{
          handle: '@hutyxxx',
          site: '@hutyxxx',
          cardType: 'summary_large_image',
        }}
        themeColor="#ffffff"
      />
      <Header />
      <RouteChangeAnimation />
      <GlobalHooks />
      {component}
      <Script
        strategy="afterInteractive"
        async
        crossOrigin="anonymous"
        src="//at.alicdn.com/t/c/font_178634_m6cwt8bb21e.js"
      />
      {pv}
    </GlobalContextProvider>
  );
};

export default App;
