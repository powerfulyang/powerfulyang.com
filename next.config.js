const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./plugins/next-css-modules');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

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
  experimental: {
    esmExternals: true,
  },
  env: {
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true, //不用自带的
  },
  optimizeFonts: false,
};

module.exports = withPlugins([[withCamelCaseCSSModules], [withBundleAnalyzer]], config);
