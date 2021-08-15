const webpack = require('webpack');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const analyzer = withBundleAnalyzer({
  webpack(config, _options) {
    config.plugins.push(
      new webpack.DefinePlugin({
        BASE_URL: JSON.stringify(process.env.BASE_URL),
      }),
    );
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
    ];
  },
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
  experimental: {
    esmExternals: true,
  },
});

module.exports = withPWA(analyzer);
