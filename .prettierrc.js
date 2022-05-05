const { prettier } = require('@powerfulyang/lint');
const tailwindcss = require('prettier-plugin-tailwindcss');

module.exports = {
  plugins: [tailwindcss],
  ...prettier,
};
