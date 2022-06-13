import type { FC } from 'react';
import React, { memo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import Head from 'next/head';
import { ProjectName } from '@/constant/Constant';
import { twitter_username } from '@/pages/_document';

dayjs.extend(LocalizedFormat);

export interface HeaderProps {
  title?: string;
  currentUrl?: string;
}

export const Header: FC<HeaderProps> = memo(({ title, currentUrl = '' }) => {
  const t = `${title ? `${title} - ` : ''}${ProjectName}`;
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
      <meta name="twitter:card" content={ProjectName} />
      <meta name="twitter:site" content={`@${twitter_username}`} />
      <meta name="twitter:creator" content={`@${twitter_username}`} />
      <meta name="twitter:url" content={`https://powerfulyang.com${currentUrl}`} />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={t} />
      <meta
        name="twitter:image"
        content="https://powerfulyang.com/icons/android-chrome-192x192.png"
      />

      <meta property="og:title" content={t} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={t} />
      <meta property="og:url" content={currentUrl} />
      <meta
        property="og:image"
        content="https://powerfulyang.com/icons/android-chrome-192x192.png"
      />

      <title>{t}</title>
    </Head>
  );
});

Header.displayName = 'Header';
