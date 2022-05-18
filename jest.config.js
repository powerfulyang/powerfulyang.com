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
  'unist-.+',
  'unified',
  'bail',
  'is-plain-obj',
  'trough',
  'mdast-util-.+',
  'hast-util-.+',
  'micromark',
  'parse-entities',
  'character-entities',
  'property-information',
  'comma-separated-tokens',
  'remark-.+',
  'rehype-.+',
  'space-separated-tokens',
  'decode-named-character-reference',
  'ccount',
  'escape-string-regexp',
  'markdown-table',
  'fault',
  'zwitch',
  'longest-streak',
  'yaml',
].join('|');

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    '^.+\\.module\\.(css|sass|scss)$',
    `node_modules/(?!${esModules})`,
  ];
  return config;
};
