import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import './app.scss';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { Header } from '@/components/Head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { isProdProcess } from '@powerfulyang/utils';
import { Redirecting } from '@/components/Redirecting';

type Props = {
  Component: AppProps['Component'] & { getLayout: any };
};

export const GTM_ID = process.env.NEXT_PUBLIC_GA_ID;

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
      <Header title={pageProps.title} />
      <Redirecting />
      {isProdProcess && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
          />
          <Script
            dangerouslySetInnerHTML={{
              __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag() {
                        dataLayer.push(arguments);
                      }
                      gtag('js', new Date());
                      gtag('config', '${GTM_ID}', {
                        page_path: window.location.pathname,
                      });
                      `,
            }}
          />
        </>
      )}
      {getLayout(<Component {...pageProps} />)}
    </GlobalContextProvider>
  );
};

export default App;
