import type { FC } from 'react';
import React, { memo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Head from 'next/head';
import { ProjectName } from '@/constant/Constant';

dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export interface HeaderProps {
  meta: {
    title: string;
    description: string;
    author: string;
    keywords: string;
  };
  link: {
    canonical: string;
  };
}

export const defaultOrigin = 'https://powerfulyang.com';
export const defaultAuthor = 'powerfulyang';
export const origin: string = process.env.NEXT_PUBLIC_ORIGIN || defaultOrigin;

export const Header: FC<HeaderProps> = memo(({ meta, link }) => {
  const { title = '404', description, author, keywords } = meta || {};
  const { canonical } = link || {};
  const t = `${title} - ${ProjectName}`;
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />

      {canonical && <link rel="canonical" href={canonical} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {description && <meta name="description" content={description} />}
      {author && <meta name="author" content={author} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hutyxxx" />
      <meta name="twitter:creator" content="@hutyxxx" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${origin}/icons/android-chrome-192x192.png`} />

      <meta property="og:title" content={t} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${origin}/icons/android-chrome-192x192.png`} />

      <title>{t}</title>
    </Head>
  );
});

Header.displayName = 'Header';
