import type { FC } from 'react';
import React, { memo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Head from 'next/head';
import { ProjectName } from '@/constant/Constant';
import { useRouter } from 'next/router';

dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export interface HeaderProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export const Header: FC<HeaderProps> = memo(({ title, description, keywords }) => {
  const t = `${title ? `${title} - ` : ''}${ProjectName}`;
  const { asPath } = useRouter();
  const origin = 'https://powerfulyang.com';
  const currentUrl = `${origin}${asPath}`;
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@hutyxxx" />
      <meta name="twitter:creator" content="@hutyxxx" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${origin}/icons/android-chrome-192x192.png`} />

      <meta property="og:title" content={t} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={`${origin}/icons/android-chrome-192x192.png`} />

      <title>{t}</title>
    </Head>
  );
});

Header.displayName = 'Header';
