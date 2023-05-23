import { Header, origin } from '@/components/Head';
import { RouteChangeAnimation } from '@/components/RouteChangeAnimation';
import { ProjectName } from '@/constant/Constant';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { useFormRouteListener } from '@/hooks/useFormDiscardWarning';
import { usePV } from '@/hooks/usePV';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import React, { useMemo } from 'react';
import 'reflect-metadata';
import './app.scss';

interface HeaderProps {
  meta?: {
    title: string;
    description: string;
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

  const component = useMemo(() => {
    if (getLayout) {
      return getLayout(<Component {...pageProps} />);
    }
    return <Component {...pageProps} />;
  }, [Component, getLayout, pageProps]);

  // 路由变化时，表单未提交的提示
  useFormRouteListener();
  // 路由变化时，PV统计
  const element = usePV();

  const { title = '404', description } = (pageProps.meta as HeaderProps['meta']) || {};
  const { canonical } = (pageProps.link as HeaderProps['link']) || {};
  const _title = `${title} - ${ProjectName}`;

  return (
    <GlobalContextProvider>
      <NextSeo
        title={_title}
        description={description}
        canonical={canonical}
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
      {component}
      <Script
        strategy="afterInteractive"
        async
        crossOrigin="anonymous"
        src="//at.alicdn.com/t/font_178634_7m8rip6osz4.js"
      />
      {element}
    </GlobalContextProvider>
  );
};

export default App;
