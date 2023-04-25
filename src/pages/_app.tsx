import { Header, origin } from '@/components/Head';
import { Redirecting } from '@/components/Redirecting';
import { ProjectName } from '@/constant/Constant';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { isProdProcess } from '@powerfulyang/utils';
import { NextSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { useEffect, useMemo } from 'react';
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

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageView = (url: string): void => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};

const App = ({ Component, pageProps }: MyAppProps) => {
  const { getLayout } = Component;

  const component = useMemo(() => {
    if (getLayout) {
      return getLayout(<Component {...pageProps} />);
    }
    return <Component {...pageProps} />;
  }, [Component, getLayout, pageProps]);

  const router = useRouter();

  useEffect(() => {
    if (isProdProcess) {
      router.events.on('routeChangeComplete', pageView);
      return () => {
        router.events.off('routeChangeComplete', pageView);
      };
    }
    return () => {};
  }, [router.events]);

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
      <Redirecting />
      {component}
      <Script
        strategy="afterInteractive"
        async
        crossOrigin="anonymous"
        src="//at.alicdn.com/t/font_178634_7m8rip6osz4.js"
      />
      {isProdProcess && (
        <>
          <Script
            strategy="afterInteractive"
            async
            crossOrigin="anonymous"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
          <Script
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag() {
                        dataLayer.push(arguments);
                      }
                      gtag('js', new Date());
                      gtag('config', '${GA_ID}', {
                        page_path: window.location.pathname,
                      });
                      `,
            }}
          />
        </>
      )}
    </GlobalContextProvider>
  );
};

export default App;
