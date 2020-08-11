import Head from 'next/head';
import React from 'react';
import '@powerfulyang/components/index.css';
import './index.scss';

const Header = ({ title }: { title: string }) => (
  <Head>
    <link rel="shortcut icon" href="/favicon.ico" />
    <title>{title}</title>
    <meta charSet="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <meta httpEquiv="X-UA-Compatible" content="IE=EmulateIE10" />
    <meta httpEquiv="X-UA-Compatible" content="IE=EmulateIE11" />
  </Head>
);

export default Header;
