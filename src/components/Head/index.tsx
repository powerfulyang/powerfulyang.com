import React, { FC } from 'react';
import Head from 'next/head';
import './index.scss';

export interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <Head>
      <title>{title || 'powerfulyang'}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
};
