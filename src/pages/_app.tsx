import React, { useEffect, useMemo } from 'react';
import type { AppProps } from 'next/app';
import './app.scss';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import type { HeaderProps } from '@/components/Head';
import { Header } from '@/components/Head';
import { useRouter } from 'next/router';
import { isProdProcess } from '@powerfulyang/utils';
import { Redirecting } from '@/components/Redirecting';
import Script from 'next/script';

type Props = {
  Component: AppProps['Component'] & { getLayout: any };
  pageProps: {
    [key: string]: any;
  } & HeaderProps;
};

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageView = (url: string): void => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};

const App = ({ Component, pageProps }: AppProps & Props) => {
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

  return (
    <GlobalContextProvider>
      <Header meta={pageProps.meta} link={pageProps.link} />
      <Redirecting />
      {component}
      <Script
        strategy="afterInteractive"
        async
        src="//at.alicdn.com/t/font_178634_7m8rip6osz4.js"
      />
      {isProdProcess && (
        <>
          <Script
            strategy="afterInteractive"
            async
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
