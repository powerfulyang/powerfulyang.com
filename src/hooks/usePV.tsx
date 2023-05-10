import { isProdProcess } from '@powerfulyang/utils';
import { useRouter } from 'next/router';
import Script from 'next/script';
import React, { useEffect } from 'react';

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageView = (url: string): void => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  });
};

export const usePV = () => {
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
    isProdProcess && (
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
    )
  );
};
