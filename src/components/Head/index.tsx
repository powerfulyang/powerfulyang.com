import React, { FC } from 'react';
import Head from 'next/head';
import './index.scss';
import { TwitterFavoriteWithNoSSR } from '@/components/dynamic';

export interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title || 'powerfulyang'}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y0JKGR6P0S" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.dataLayer = window.dataLayer || [];\n' +
              '  function gtag(){dataLayer.push(arguments);}\n' +
              "  gtag('js', new Date());\n" +
              '\n' +
              "  gtag('config', 'G-Y0JKGR6P0S');",
          }}
        />
      </Head>
      <TwitterFavoriteWithNoSSR />
    </>
  );
};
