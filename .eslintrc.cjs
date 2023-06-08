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
  overrides: eslint.overrides.map((override) => {
    const rules = {
      ...override.rules,
      'react/no-unknown-property': 'off',
    }
    return {
      ...override,
      rules,
    };
  }),
};
