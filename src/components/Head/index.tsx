import type { FC } from 'react';
import React, { memo } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import Head from 'next/head';
import { ProjectName } from '@/constant/Constant';
import { Redirecting } from '../Redirecting';

dayjs.extend(LocalizedFormat);

export interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = memo(({ title }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width,minimum-scale=1.0, maximum-scale=1.0"
        />
        <title>{`${(title && `${title} - `) || ''}${ProjectName}`}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Redirecting />
    </>
  );
});

Header.displayName = 'Header';
