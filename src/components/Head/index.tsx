import Head from 'next/head';
import type { FC } from 'react';

export const defaultOrigin = 'https://powerfulyang.com';
export const origin: string = process.env.NEXT_PUBLIC_ORIGIN || defaultOrigin;

export const Header: FC = () => {
  return (
    <Head>
      <meta
        name="viewport"
        content="initial-scale=1.0, width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
    </Head>
  );
};

Header.displayName = 'Header';
