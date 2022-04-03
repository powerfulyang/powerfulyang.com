const withPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./plugins/next-css-modules');
const { isDevProcess } = require('@powerfulyang/utils');

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
    buildExcludes: [/manifest\.js$/],
  },
  experimental: {
    esmExternals: true,
  },
  env: {
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
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
