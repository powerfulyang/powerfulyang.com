const withPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./plugins/next-css-modules');
const { isDevProcess, isProdProcess } = require('@powerfulyang/utils');
/**
 * @type {string[]}
 */
const runtimeCaching = require('next-pwa/cache');
const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {string}
 */
const API_ENV = process.env.API_ENV;

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const excludeCacheNames = ['next-data', 'apis'];

const defaultCacheRule = runtimeCaching.filter((x) => {
  return !excludeCacheNames.includes(x.options.cacheName);
});

if (API_ENV === 'prod') {
  process.env.CLIENT_BASE_HOST = 'api.powerfulyang.com';
  process.env.SERVER_BASE_URL = 'https://api.powerfulyang.com/api';
}
if (API_ENV === 'qa') {
  process.env.CLIENT_BASE_HOST = 'qa.powerfulyang.com';
  process.env.SERVER_BASE_URL = 'https://qa.powerfulyang.com/api';
}
if (API_ENV === 'local') {
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
    CLIENT_BASE_HOST: process.env.CLIENT_BASE_HOST,
    NEXT_PUBLIC_SENTRY_DSN:
      'https://f4e15b44f3674255b6eed1cb673c0dcb@o417744.ingest.sentry.io/6340260',
  },
  eslint: {
    ignoreDuringBuilds: true, //不用自带的
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  sentry: {
    disableServerWebpackPlugin: isDevProcess,
    disableClientWebpackPlugin: isDevProcess,
  },
  productionBrowserSourceMaps: isProdProcess,
  optimizeFonts: false,
  swcMinify: false,
};

module.exports = withPlugins(
  [
    withCamelCaseCSSModules,
    withPWA,
    withBundleAnalyzer,
    [withSentryConfig, sentryWebpackPluginOptions],
  ],
  config,
);
