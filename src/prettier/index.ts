import * as postcssParser from 'prettier/plugins/postcss';
import * as htmlParser from 'prettier/plugins/html';
import * as markdownParser from 'prettier/plugins/markdown';
import * as babelParser from 'prettier/plugins/babel';
import * as typescriptParser from 'prettier/plugins/typescript';
import * as yamlParser from 'prettier/plugins/yaml';
import * as estreeParser from 'prettier/plugins/estree';
import { format } from 'prettier/standalone';

export async function prettify(language: string, value: string) {
  let result;

  if (language === 'json') {
    result = JSON.stringify(JSON.parse(value), null, 2);
  } else {
    result = await format(value, {
      parser: language,
      plugins: [
        postcssParser,
        htmlParser,
        markdownParser,
        babelParser,
        typescriptParser,
        yamlParser,
        estreeParser,
      ],
      // Print semicolons at the ends of statements.
      // 意思是在语句的末尾打印分号。
      semi: true,
    });
  }

  return result;
}
