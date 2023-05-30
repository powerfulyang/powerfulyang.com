import { CDN_ORIGIN, generateCdnStaticUrl, ProjectName } from '@/constant/Constant';
import { cache } from '@/context/GlobalContextProvider';
import createEmotionServer from '@emotion/server/create-instance';
import type { DocumentContext, DocumentProps } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

const MyDocument = ({ emotionStyleTags }: MyDocumentProps) => {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href={CDN_ORIGIN} crossOrigin="anonymous" />
        <link
          rel="preload"
          href="/fonts/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJVD7Ng.woff2"
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
        {emotionStyleTags}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

// `getInitialProps` belongs to `_document` (instead of `_app`),

// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const _server_cache = createEmotionServer(cache);

  // eslint-disable-next-line no-param-reassign
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props) {
          return <App {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = _server_cache.extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default MyDocument;
