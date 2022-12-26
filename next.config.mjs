import withPWAConfig from 'next-pwa';
import { isDevProcess } from '@powerfulyang/utils';
import runtimeCaching from 'next-pwa/cache.js';
import { withSentryConfig } from '@sentry/nextjs';
import BundleAnalyzer from '@next/bundle-analyzer';

/**
 * @type {string}
 */
const { API_ENV, DISABLE_SENTRY_CLI } = process.env;

const isDisableSentry = DISABLE_SENTRY_CLI === 'true';

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
  process.env.CLIENT_BASE_HOST = 'powerfulyang.com';
  process.env.SERVER_BASE_URL = 'https://api.powerfulyang.com/api';
}
if (API_ENV === 'qa') {
  process.env.CLIENT_BASE_HOST = 'qa.powerfulyang.com';
  process.env.SERVER_BASE_URL = 'https://qa.powerfulyang.com/api';
}
if (API_ENV === 'local') {
  process.env.SERVER_BASE_URL = 'http://localhost:3001/api';
}

/**
 * @type {import('next').NextConfig}
 */
const config = {
  rewrites() {
    return Promise.resolve([
      {
        source: '/',
        destination: '/post',
      },
      {
        source: '/post/publish',
        destination: '/post/publish/0',
      },
    ]);
  },
  experimental: {
    esmExternals: true,
    scrollRestoration: true,
  },
  env: {
    CLIENT_BASE_HOST: process.env.CLIENT_BASE_HOST,
    NEXT_PUBLIC_SENTRY_DSN:
      'https://15cbb27739a345dab5ab27ceb9491de0@o4504332393578496.ingest.sentry.io/4504332396134400',
    NEXT_PUBLIC_GA_ID: 'G-T622M0KSVS',
  },
  eslint: {
    ignoreDuringBuilds: true, // 不用自带的
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: !isDisableSentry,
  optimizeFonts: true,
  swcMinify: true,
};

// config

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const withPWA = withPWAConfig({
  dest: 'public',
  disable: isDevProcess,
  sourcemap: false,
  buildExcludes: [/\.map$/],
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
        // eslint-disable-next-line no-restricted-globals
        const isSameOrigin = self.origin === url.origin;
        const { pathname } = url;
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
});
const nextConfig = withSentryConfig(
  {
    sentry: {
      disableServerWebpackPlugin: isDisableSentry,
      disableClientWebpackPlugin: isDisableSentry,
      hideSourceMaps: true,
      widenClientFileUpload: true,
    },
    ...config,
    ...withBundleAnalyzer(
      withPWA({
        webpack: (c) => {
          // camel-case style names from css modules
          c.module.rules
            .find(({ oneOf }) => !!oneOf)
            .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
            .reduce((acc, { use }) => acc.concat(use), [])
            .forEach(({ options: draft }) => {
              if (draft.modules) {
                draft.modules.exportLocalsConvention = 'camelCase';
              }
            });
          return c;
        },
      }),
    ),
  },
  sentryWebpackPluginOptions,
);
export default nextConfig;
