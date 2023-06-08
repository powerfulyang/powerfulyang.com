import type { FC } from 'react';
import React, { memo } from 'react';
import Head from 'next/head';

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
