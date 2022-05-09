import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { ProjectName } from '@/constant/Constant';
import Script from 'next/script';
import { isProdProcess } from '@powerfulyang/utils';

const Document = () => {
  return (
    <Html lang="zh">
      <Head>
        <link rel="preload" href="/zpix.woff" as="font" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="application-name" content={ProjectName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={ProjectName} />
        <meta name="description" content={ProjectName} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/favicon-32x32.png" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content={ProjectName} />
        <meta name="twitter:url" content="https://powerfulyang.com" />
        <meta name="twitter:title" content={ProjectName} />
        <meta name="twitter:description" content={ProjectName} />
        <meta
          name="twitter:image"
          content="https://powerfulyang.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@hutyxxx" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={ProjectName} />
        <meta property="og:description" content={ProjectName} />
        <meta property="og:site_name" content={ProjectName} />
        <meta property="og:url" content="https://powerfulyang.com" />
        <meta property="og:image" content="https://powerfulyang.com/icons/apple-touch-icon.png" />
      </Head>
      {isProdProcess && (
        <Script
          id="google-analytics"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-T622M0KSVS"
          onLoad={() => {
            window.dataLayer = window.dataLayer || [];
            function gtag(...rest: any[]) {
              // @ts-ignore
              // eslint-disable-next-line prefer-rest-params
              window.dataLayer.push(rest);
            }
            gtag('js', new Date());

            gtag('config', 'G-T622M0KSVS');
          }}
        />
      )}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
