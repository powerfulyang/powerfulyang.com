import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import './app.scss';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';
import { useRouter } from 'next/router';
import { isProdProcess } from '@powerfulyang/utils';
import { Redirecting } from '@/components/Redirecting';
import Script from 'next/script';

type Props = {
  Component: AppProps['Component'] & { getLayout: any };
  pageProps: {
    [key: string]: any;
  };
};

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageView = (url: string): void => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};

const App = ({ Component, pageProps }: AppProps & Props) => {
  const getLayout = Component.getLayout || ((page: typeof Component) => page);
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
      <Header
        title={pageProps.title}
        description={pageProps.description}
        keywords={pageProps.keywords}
      />
      <Redirecting />
      {getLayout(<Component {...pageProps} />)}
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
            async
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
