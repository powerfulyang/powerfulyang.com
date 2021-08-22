const lint = require('@powerfulyang/lint');

module.exports = {
  ...lint.stylelint,
  rules: {
    ...lint.stylelint.rules,
    // overflow: overlay
  },
};
