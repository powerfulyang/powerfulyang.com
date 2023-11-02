const nextJest = require('next/jest');
const { pathsToModuleNameMapper } = require('@powerfulyang/lint');
const tsconfig = require('./tsconfig.json');

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
  prefix: '<rootDir>/',
});

const createJestConfig = nextJest();

/**
 * @type {import('jest').Config}
 */
const customJestConfig = {
  moduleNameMapper: {
    ...moduleNameMapper,
    '^rxjs(/operators)?$': '<rootDir>/node_modules/rxjs/dist/cjs/index.js',
    '@docsearch/react': '<rootDir>/node_modules/@docsearch/react/dist/esm/DocSearch.js',
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

const asyncConfig = createJestConfig(customJestConfig);

const esModules = ['@docsearch.+', 'algoliasearch'].join('|');

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    '^.+\\.module\\.(css|sass|scss)$',
    `node_modules/.pnpm/(?!${esModules})`,
  ];
  return config;
};
