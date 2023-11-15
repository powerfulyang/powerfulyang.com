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
const { dependencies, devDependencies } = pkg.packageJson;
const ffmpegVersion = devDependencies['@ffmpeg/core-mt'].replaceAll('.', '');
const onigasmVersion = dependencies.onigasm.replaceAll('.', '');

const { SENTRY_AUTH_TOKEN } = process.env;

const disableSentryWebpackPlugin = !SENTRY_AUTH_TOKEN;

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  urlPrefix: 'app:///',
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
    ]);
  },
  headers() {
    return [
      {
        source: '/_next/static/chunks/coop.ffmpeg(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/tools/video-converter',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/_next/static/ffmpeg/(.*)/ffmpeg-core.worker.js',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
  experimental: {
    scrollRestoration: true,
    clientRouterFilter: false,
  },
  env: {
    NEXT_PUBLIC_SENTRY_DSN:
      'https://15cbb27739a345dab5ab27ceb9491de0@o4504332393578496.ingest.sentry.io/4504332396134400',
    NEXT_PUBLIC_GA_ID: 'G-T622M0KSVS',
    NEXT_PUBLIC_ONIGASM_VERSION: onigasmVersion,
    NEXT_PUBLIC_FFMPEG_VERSION: ffmpegVersion,
    CLIENT_BASE_HOST: process.env.CLIENT_BASE_HOST || 'api.powerfulyang.com',
    SERVER_BASE_URL: process.env.SERVER_BASE_URL || 'https://api.powerfulyang.com',
  },
  eslint: {
    ignoreDuringBuilds: true, // 不用自带的
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: !disableSentryWebpackPlugin,
  optimizeFonts: true,
  swcMinify: true,
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  compiler: {
    removeConsole: true,
    reactRemoveProperties: true,
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
  additionalManifestEntries: [],
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
      if (!asset.name.startsWith('static/runtime/')) {
        return true;
      }
      return true;
    },
  ],
  runtimeCaching,
  customWorkerDir: 'src/pwa-workers',
});

const nextConfig = withSentryConfig(
  {
    sentry: {
      disableServerWebpackPlugin: disableSentryWebpackPlugin,
      disableClientWebpackPlugin: disableSentryWebpackPlugin,
      hideSourceMaps: true,
      widenClientFileUpload: true,
    },
    ...config,
    ...withBundleAnalyzer(
      withPWA({
        webpack: (c, { isServer, nextRuntime }) => {
          const _c = c;
          // edge runtime
          if (nextRuntime === 'edge') {
            _c.resolve.fallback.stream = false;
          }
          // disable cache
          if (process.env.CF_PAGES === '1') {
            _c.cache = false;
          }
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
                    from: path.resolve('node_modules/@ffmpeg/core-mt/dist/umd'),
                    to: path.resolve(`.next/static/ffmpeg/${ffmpegVersion}`),
                    info: () => {
                      return {
                        minimized: true,
                      };
                    },
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
