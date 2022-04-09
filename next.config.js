const withPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./plugins/next-css-modules');
const { isDevProcess } = require('@powerfulyang/utils');

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
