import { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { CDN_ORIGIN, generateCdnStaticUrl, ProjectName } from '@/constant/Constant';

const MyDocument = () => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href={CDN_ORIGIN} crossOrigin="anonymous" />
        <link
          rel="preload"
          href={generateCdnStaticUrl('/fonts/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7Ng.woff2')}
          as="font"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={generateCdnStaticUrl('/fonts/zpix.woff')}
          as="font"
          crossOrigin="anonymous"
        />

        <meta charSet="utf-8" />
        <meta name="application-name" content={ProjectName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={ProjectName} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/favicon-32x32.png" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="/rss.xml" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument;
