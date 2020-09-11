import Head from 'next/head';
import React from 'react';
import '@powerfulyang/components/index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons';
import './index.scss';

library.add(fab, faCheckSquare, faCoffee);

const IconHead = () => (
  <Head>
    <link rel="shortcut icon" href="/favicon.ico" />
    <title>powerfulyang</title>
    <meta charSet="utf-8" />
    <link
      href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=block"
      rel="preload"
      as="style"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=block"
      rel="stylesheet"
    />
    <link rel="prerender" href="https://gallery.powerfulyang.com" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <meta httpEquiv="X-UA-Compatible" content="IE=EmulateIE10" />
    <meta httpEquiv="X-UA-Compatible" content="IE=EmulateIE11" />
  </Head>
);

export default IconHead;
