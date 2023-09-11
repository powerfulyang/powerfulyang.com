import process from 'node:process';
import path from 'node:path';
import BundleAnalyzer from '@next/bundle-analyzer';
import { isDevProcess } from '@powerfulyang/utils';
import { withSentryConfig } from '@sentry/nextjs';
import withPWAConfig from 'next-pwa';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { readPackageUp } from 'read-pkg-up';
import { runtimeCaching } from './runtimeCaching.mjs';

const pkg = await readPackageUp();
const { dependencies } = pkg.packageJson;
const ffmpegVersion = dependencies['@ffmpeg/ffmpeg'].replaceAll('.', '');
const onigasmVersion = dependencies.onigasm.replaceAll('.', '');

const { SENTRY_AUTH_TOKEN } = process.env;

const enableSentryWebpackPlugin = !!SENTRY_AUTH_TOKEN;

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
        source: '/app_post/year/:year',
        destination: '/app_post',
      },
      {
        source: '/post/publish',
        destination: '/post/publish/0',
      },
    ]);
  },
  experimental: {
    scrollRestoration: true,
    appDir: true,
    clientRouterFilter: false,
  },
  env: {
    CLIENT_BASE_HOST: process.env.CLIENT_BASE_HOST,
    NEXT_PUBLIC_SENTRY_DSN:
      'https://15cbb27739a345dab5ab27ceb9491de0@o4504332393578496.ingest.sentry.io/4504332396134400',
    NEXT_PUBLIC_GA_ID: 'G-T622M0KSVS',
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    NEXT_PUBLIC_FFMPEG_VERSION: ffmpegVersion,
    NEXT_PUBLIC_ONIGASM_VERSION: onigasmVersion,
  },
  eslint: {
    ignoreDuringBuilds: true, // 不用自带的
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: enableSentryWebpackPlugin,
  optimizeFonts: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  // next.js didn't compile dependencies in node_modules, use transpileModules to fix it
  transpilePackages: ['yaml', 'react-syntax-highlighter', '@powerfulyang/utils'],
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
    'react-syntax-highlighter': {
      // 这个更牛啤，减少了 0.5kb
      transform: 'react-syntax-highlighter/dist/esm/{{kebabCase member}}',
    },
  },
};

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
  customWorkerDir: 'src/pwa-workers',
});

const nextConfig = withSentryConfig(
  {
    sentry: {
      disableServerWebpackPlugin: !enableSentryWebpackPlugin,
      disableClientWebpackPlugin: !enableSentryWebpackPlugin,
      hideSourceMaps: true,
      widenClientFileUpload: true,
    },
    ...config,
    ...withBundleAnalyzer(
      withPWA({
        webpack: (c, { isServer }) => {
          const _c = c;
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
          // monaco-editor vue.worker
          c.module.rules.push({
            test: /monaco-volar[\\/]dist[\\/]worker[\\/]vue\.worker\.js$/,
            type: 'asset/resource',
            use: [
              {
                loader: 'string-replace-loader',
                options: {
                  search: 'process.env.NODE_ENV',
                  replace: JSON.stringify(process.env.NODE_ENV),
                  flags: 'g', // 全局替换
                },
              },
            ],
          });
          // wasm
          _c.experiments.asyncWebAssembly = true;

          if (!isServer) {
            // 在客户端构建中替换fs
            _c.resolve.fallback.fs = false;
            _c.resolve.fallback.child_process = false;

            // 妈的，垃圾连个设置的地方都没有
            // _c.optimization.minimizer

            // handle monaco editor
            c.plugins.push(
              new MonacoWebpackPlugin({
                // Add languages as needed...
                // languages: ['markdown'],
                filename: 'static/[contenthash:10].worker.js',
              }),
            );

            // handle ffmpeg
            c.plugins.push(
              new CopyWebpackPlugin({
                patterns: [
                  {
                    from: path.resolve('node_modules/@ffmpeg/core/dist/umd'),
                    to: path.resolve(`.next/static/ffmpeg/${ffmpegVersion}`),
                  },
                  {
                    from: path.resolve('node_modules/onigasm/lib/onigasm.wasm'),
                    to: path.resolve(`.next/static/onigasm/${onigasmVersion}/onigasm.wasm`),
                  },
                ],
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
