const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);
const nextJest = require('next/jest');

const createJestConfig = nextJest();

const customJestConfig = {
  moduleNameMapper,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.js'],
  transformIgnorePatterns: ['node_modules/(?!react-markdown)'],
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
  'remark-.+',
  'mdast-util-.+',
  'micromark',
  'parse-entities',
  'character-entities',
  'property-information',
  'comma-separated-tokens',
  'hast-util-whitespace',
  'remark-.+',
  'space-separated-tokens',
  'decode-named-character-reference',
  'ccount',
  'escape-string-regexp',
  'markdown-table',
].join('|');

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    '^.+\\.module\\.(css|sass|scss)$',
    `node_modules/(?!${esModules})`,
  ];
  return config;
};
