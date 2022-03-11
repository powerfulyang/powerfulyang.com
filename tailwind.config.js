// eslint-disable-next-line import/no-extraneous-dependencies
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/**/*.tsx'],
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        '.pointer': {
          cursor: `url('/cursor/pointer.ico'), pointer`,
        },
        '.default': {
          cursor: `url('/cursor/default.ico'), default`,
        },
      });
    }),
  ],
};
