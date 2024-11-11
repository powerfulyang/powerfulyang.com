import BundleAnalyzer from '@next/bundle-analyzer';
import {isDevProcess, isProdProcess} from '@powerfulyang/utils';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import withPWAConfig from 'next-pwa';
import process from 'node:process';
import {runtimeCaching} from './runtimeCaching.mjs';

/**
 * @type {import('next').NextConfig}
 */
const config = {
  rewrites() {
    return Promise.resolve([
      {
        source: '/',
        destination: '/post/year/2024',
      },
      {
        source: '/post',
        destination: '/post/year/2024',
      },
      {
        source: '/api/:path*', // 请求的路径前缀
        destination: 'https://api.powerfulyang.com/api/:path*' // 目标服务器
      }
    ]);
  },
  experimental: {
    scrollRestoration: true,
    clientRouterFilter: false,
  },
  env: {
    NEXT_PUBLIC_SENTRY_DSN:
      'https://15cbb27739a345dab5ab27ceb9491de0@o4504332393578496.ingest.sentry.io/4504332396134400',
    NEXT_PUBLIC_GA_ID: 'G-T622M0KSVS',
    SERVER_BASE_URL: process.env.SERVER_BASE_URL || 'https://api.powerfulyang.com',
  },
  eslint: {
    ignoreDuringBuilds: true, // 不用自带的
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: ['./src/styles'],
    silenceDeprecations: ["legacy-js-api", "import"], // 👈 HERE
  },
  compiler: {
    removeConsole: isProdProcess,
    reactRemoveProperties: isProdProcess,
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
    ({asset}) => {
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
  cacheStartUrl: false,
  dynamicStartUrl: false,
});

const nextConfig = {
  ...config,
  ...withBundleAnalyzer(
    withPWA({
      webpack: (c, {isServer}) => {
        const _c = c;
        // camel-case style names from css modules
        c.module.rules
          .find(({oneOf}) => !!oneOf)
          .oneOf.filter(({use}) => JSON.stringify(use)?.includes('css-loader'))
          .reduce((acc, {use}) => acc.concat(use), [])
          .forEach(({options: draft}) => {
            if (draft?.modules?.exportLocalsConvention) {
              draft.modules.exportLocalsConvention = 'camelCase';
            }
          });
        // due to https://github.com/vercel/next.js/pull/59246, edge runtime bundle next/dynamic{ssr:false} in the server bundle,
        // which will cause the server bundle to be too large.
        // It makes Edge Function size larger than 1MB,
        // so we need to modify the webpack config to make it work
        // c.module.rules.forEach((rule) => {
        //   if (JSON.stringify(rule)?.includes('next-swc-loader')) {
        //     rule.oneOf.forEach(({ use }) => {
        //       if (Array.isArray(use)) {
        //         use.forEach((item) => {
        //           if (item.loader === 'next-swc-loader') {
        //             // eslint-disable-next-line no-param-reassign
        //             item.options.esm = true;
        //           }
        //         });
        //       }
        //       if (use?.loader === 'next-swc-loader') {
        //         // eslint-disable-next-line no-param-reassign
        //         use.options.esm = true;
        //       }
        //     });
        //   }
        // });

        // wasm
        // _c.experiments.asyncWebAssembly = true;

        if (!isServer) {
          // 在客户端构建中替换fs
          // _c.resolve.fallback.fs = false;
          // _c.resolve.fallback.child_process = false;

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
        }

        return c;
      },
    }),
  ),
};

export default nextConfig;
