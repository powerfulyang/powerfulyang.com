const withPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./plugins/next-css-modules');
const { isDevProcess } = require('@powerfulyang/utils');
const runtimeCaching = require('next-pwa/cache');

const excludeCacheNames = ['next-data', 'apis'];

const defaultCacheRule = runtimeCaching.filter((x) => {
  return !excludeCacheNames.includes(x.options.cacheName);
});

const API_ENV = process.env.API_ENV;
if (API_ENV === 'prod') {
  process.env.CLIENT_BASE_URL = 'https://api.powerfulyang.com/api';
  process.env.SERVER_BASE_URL = 'https://api.powerfulyang.com/api';
}
if (API_ENV === 'qa') {
  process.env.CLIENT_BASE_URL = 'https://qa.powerfulyang.com/api';
  process.env.SERVER_BASE_URL = 'https://qa.powerfulyang.com/api';
}
if (API_ENV === 'local') {
  process.env.CLIENT_BASE_URL = '/api';
  process.env.SERVER_BASE_URL = 'http://localhost:3001/api';
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 */
const config = {
  rewrites() {
    return [
      {
        source: '/',
        destination: '/post',
      },
      {
        source: '/post/thumbnail/:id',
        destination: '/post',
      },
      {
        source: '/post/publish',
        destination: '/post/publish/0',
      },
    ];
  },
  pwa: {
    dest: 'public',
    disable: isDevProcess,
    runtimeCaching: [
      ...defaultCacheRule,
      {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'next-data',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 1, // fall back to cache if api does not response within 1 seconds
        },
      },
      {
        urlPattern: ({ url }) => {
          const isSameOrigin = self.origin === url.origin;
          const pathname = url.pathname;
          return isSameOrigin && pathname.startsWith('/api/');
        },
        handler: 'NetworkFirst',
        method: 'GET',
        options: {
          cacheName: 'apis',
          expiration: {
            maxEntries: 16,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 1, // fall back to cache if api does not response within 1 seconds
        },
      },
    ],
  },
  experimental: {
    esmExternals: true,
  },
  env: {
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL || '',
  },
  eslint: {
    ignoreDuringBuilds: true, //不用自带的
  },
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withPlugins([[withCamelCaseCSSModules], [withPWA], [withBundleAnalyzer]], config);
