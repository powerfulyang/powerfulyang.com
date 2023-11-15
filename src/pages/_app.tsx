import { GlobalHooks } from '@/components/GlobalHooks';
import { Header, origin } from '@/components/Head';
import { RouteChangeAnimation } from '@/components/RouteChangeAnimation';
import { ProjectName } from '@/constant/Constant';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { PV } from '@/hooks/usePV';
import NotFound from '@/pages/404';
import '@/styles/app.scss';
import { trpc } from '@/utils/trpc';
import { Analytics } from '@vercel/analytics/react';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import React, { useMemo } from 'react';
import 'reflect-metadata';

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

// interface 真是优雅
export interface MyAppProps extends AppProps {
  Component: AppProps['Component'] & { getLayout: any };
  pageProps: {
    [key: string]: any;
  } & HeaderProps;
}

const App = ({ Component, pageProps }: MyAppProps) => {
  const { getLayout } = Component;
  // @ts-ignore
  const notFound = Component === NotFound;

  const component = useMemo(() => {
    if (getLayout) {
      return getLayout(<Component {...pageProps} />);
    }
    return <Component {...pageProps} />;
  }, [Component, getLayout, pageProps]);

  const {
    title = '404',
    description,
    noindex = notFound,
    nofollow = notFound,
  } = pageProps.meta || {};

  const { canonical } = pageProps.link || {};

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
      <PV />
      <Analytics />
    </GlobalContextProvider>
  );
};

export default trpc.withTRPC(App);
