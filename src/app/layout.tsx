import { ReactQueryProvider } from '@/context/react-query';
import type { Metadata, Viewport } from 'next';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { PreloadResources } from '@/components/PreloadResources';
import { ProjectName } from '@/constant/Constant';
import { UserLayout } from '@/layout/UserLayout';

export const metadata: Metadata = {
  metadataBase: new URL('https://powerfulyang.com'),
  title: {
    default: 'Home',
    template: `%s - ${ProjectName}`,
  },
  applicationName: ProjectName,
  formatDetection: {
    telephone: false,
  },
  icons: [
    {
      url: '/icons/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      url: '/icons/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
  ],
  manifest: 'manifest.json',
  alternates: {
    types: {
      'application/rss+xml': 'rss.xml',
    },
  },
};

export const viewport: Viewport = {
  colorScheme: 'normal',
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <PreloadResources />
        <ReactQueryProvider>
          <UserLayout>{children}</UserLayout>
        </ReactQueryProvider>
        <script async src="//at.alicdn.com/t/c/font_178634_m6cwt8bb21e.js" />
      </body>
    </html>
  );
};

export default Layout;

export const runtime = 'edge';
