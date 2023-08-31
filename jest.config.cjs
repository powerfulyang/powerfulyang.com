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
  moduleNameMapper,
  testEnvironment: 'jsdom',
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
  'lodash-es',
  'github-slugger',
  'react-syntax-highlighter',
  'hastscript',
  'web-namespaces',
  'character.+',
  'is.+',
  'stringify.+',
  'emo.+',
  'html.+',
  '@mediapipe.+',
  '@prettier.+',
].join('|');

module.exports = async () => {
  const config = await asyncConfig();
  config.transformIgnorePatterns = [
    '^.+\\.module\\.(css|sass|scss)$',
    `node_modules/.pnpm/(?!${esModules})`,
  ];
  return config;
};
