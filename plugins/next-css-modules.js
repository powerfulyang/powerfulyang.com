/**
 * https://github.com/vercel/next.js/discussions/11267#discussioncomment-1758
 */

module.exports = {
  webpack: (config) => {
    // camel-case style names from css modules
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          // eslint-disable-next-line no-param-reassign
          options.modules.exportLocalsConvention = 'camelCase';
        }
      });

    return config;
  },
};
