export const prettierParsers = {
  css: 'postcss',
  javascript: 'babel',
  jsx: 'babel',
  svg: 'html',
  xml: 'html',
  typescript: 'typescript',
} as Record<string, string>;

export const supportedLanguages = [
  'json',
  'babylon',
  'html',
  'postcss',
  'graphql',
  'markdown',
  'yaml',
  'typescript',
  'flow',
  ...Object.keys(prettierParsers),
];
