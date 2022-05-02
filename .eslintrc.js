const { eslint } = require('@powerfulyang/lint');

module.exports = {
  ...eslint,
  rules: {
    ...eslint.rules,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '**/*.mjs': 'always',
      },
    ],
  },
};
