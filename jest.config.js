const nextJest = require('next/jest');
const { pathsToModuleNameMapper } = require('@powerfulyang/lint');
const tsconfig = require('./tsconfig.json');

const moduleNameMapper = pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
  prefix: '<rootDir>/',
});

const createJestConfig = nextJest();

const customJestConfig = {
  moduleNameMapper,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.ts'],
};

const asyncConfig = createJestConfig(customJestConfig);

const esModules = [
  'react-markdown',
  'vfile',
  'unified',
  'bail',
  'is-plain-obj',
  'trough',
  'micromark',
  'parse-entities',
  'character-entities',
  'property-information',
  'comma-separated-tokens',
  'remark-.+',
  'rehype-.+',
  'unist-.+',
  'mdast-.+',
  'hast-.+',
  'space-separated-tokens',
  'decode-named-character-reference',
  'ccount',
  'escape-string-regexp',
  'markdown-table',
  'fault',
  'zwitch',
  'longest-streak',
  'yaml',
  'remark',
  'trim-lines',
].join('|');

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    '^.+\\.module\\.(css|sass|scss)$',
    `node_modules/.pnpm/(?!${esModules})`,
  ];
  return config;
};
