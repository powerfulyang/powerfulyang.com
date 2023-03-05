import withPWAConfig from 'next-pwa';
import { isDevProcess } from '@powerfulyang/utils';
import { withSentryConfig } from '@sentry/nextjs';
import BundleAnalyzer from '@next/bundle-analyzer';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import { runtimeCaching } from './runtimeCaching.mjs';

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

if (API_ENV === 'prod') {
  process.env.CLIENT_BASE_HOST = 'powerfulyang.com';
}
if (API_ENV === 'qa') {
  process.env.CLIENT_BASE_HOST = 'qa.powerfulyang.com';
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
        source: '/post/year/:year',
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
    appDir: true,
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
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: !isDisableSentry,
  optimizeFonts: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  // next.js didn't compile dependencies in node_modules, use transpileModules to fix it
  transpilePackages: ['yaml', 'react-syntax-highlighter'],
  // below option will reduce the size of the bundle... only 2kb
  modularizeImports: {
    lodash: {
      transform: 'lodash-es/{{member}}',
    },
    'lodash\\.([_\\w]+)': {
      transform: 'lodash-es/{{ matches.[1] }}',
    },
    'lodash/((([_\\w])?/?)*)': {
      transform: 'lodash-es/{{ matches.[1] }}/{{member}}',
    },
    'lodash-es': {
      transform: 'lodash-es/{{member}}',
    },
    ramda: {
      transform: 'ramda/es/{{member}}',
    },
    'react-syntax-highlighter': {
      // 这个更牛啤，减少了 0.5kb
      transform: 'react-syntax-highlighter/dist/esm/{{kebabCase member}}',
    },
  },
};

// config

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
const withPWA = withPWAConfig({
  dest: 'public',
  disable: isDevProcess,
  sourcemap: false,
  exclude: [
    /\.map$/,
    // add buildExcludes here
    ({ asset }) => {
      if (
        asset.name.startsWith('server/') ||
        asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
      ) {
        return true;
      }
      return isDevProcess && !asset.name.startsWith('static/runtime/');
    },
  ],
  runtimeCaching,
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
        webpack: (c, options) => {
          // camel-case style names from css modules
          c.module.rules
            .find(({ oneOf }) => !!oneOf)
            .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
            .reduce((acc, { use }) => acc.concat(use), [])
            .forEach(({ options: draft }) => {
              if (draft?.modules?.exportLocalsConvention) {
                draft.modules.exportLocalsConvention = 'camelCase';
              }
            });
          if (!options.isServer) {
            c.plugins.push(
              new MonacoWebpackPlugin({
                // Add languages as needed...
                languages: ['markdown'],
                filename: 'static/[name].worker.js',
              }),
            );
          }
          return c;
        },
      }),
    ),
  },
  sentryWebpackPluginOptions,
);
export default nextConfig;
