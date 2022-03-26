const withPWA = require('next-pwa');
const withPlugins = require('next-compose-plugins');
const withCamelCaseCSSModules = require('./plugins/next-css-modules');
const { isDevProcess } = require('@powerfulyang/utils');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const config = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    });
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/',
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
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true, //不用自带的
  },
};

module.exports = withPlugins([[withCamelCaseCSSModules], [withPWA], [withBundleAnalyzer]], config);
