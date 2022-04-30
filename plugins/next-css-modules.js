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
      .forEach(({ options: draft }) => {
        if (draft.modules) {
          draft.modules.exportLocalsConvention = 'camelCase';
        }
      });

    return config;
  },
};
