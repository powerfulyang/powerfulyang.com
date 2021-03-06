import React, { FC } from 'react';
import Head from 'next/head';
import { __prod__ } from '@powerfulyang/utils';
import dayjs from 'dayjs';
import { Redirecting } from '../Redirecting';

const LocalizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(LocalizedFormat);

export interface HeaderProps {
  title?: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title || `Styx's home page`}</title>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width,minimum-scale=1.0, maximum-scale=1.0"
        />
        {__prod__ && (
          <>
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y0JKGR6P0S" />
            <script
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{
                __html:
                  'window.dataLayer = window.dataLayer || [];\n' +
                  '  function gtag(){dataLayer.push(arguments);}\n' +
                  "  gtag('js', new Date());\n" +
                  '\n' +
                  "  gtag('config', 'G-Y0JKGR6P0S');",
              }}
            />
          </>
        )}
      </Head>
      <Redirecting />
    </>
  );
};
