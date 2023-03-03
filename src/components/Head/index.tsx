import type { FC } from 'react';
import React, { memo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Head from 'next/head';

dayjs.extend(LocalizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const defaultOrigin = 'https://powerfulyang.com';
export const origin: string = process.env.NEXT_PUBLIC_ORIGIN || defaultOrigin;

export const Header: FC = memo(() => {
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
    </Head>
  );
});

Header.displayName = 'Header';
