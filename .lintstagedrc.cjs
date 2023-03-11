module.exports = {
  '**/*.{ts,tsx,json,js,mjs,mts,cjs,cts,jsx,md}': ['prettier --write'],
  '**/*.{ts,tsx,js,mjs,mts,cjs,cts,jsx}': ['eslint --fix'],
  '**/*.scss': ['stylelint --fix'],
};
