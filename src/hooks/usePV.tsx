import { isProdProcess } from '@powerfulyang/utils';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const pageView = (url: string): void => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};

const _usePV = () => {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeComplete', pageView);
    return () => {
      router.events.off('routeChangeComplete', pageView);
    };
  }, [router.events]);

  return (
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
  );
};

const usePV = isProdProcess ? _usePV : () => null;

export const PV = () => {
  return usePV();
};
