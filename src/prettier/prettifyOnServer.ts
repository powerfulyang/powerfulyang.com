import * as pugParser from '@prettier/plugin-pug';
import type { Options } from 'prettier';
import { format } from 'prettier/standalone';

export function prettify(language: string, value: string, options?: Options) {
  return format(value, {
    parser: language,
    plugins: [pugParser],
    // Print semicolons at the ends of statements.
    // 意思是在语句的末尾打印分号。
    semi: true,
    ...options,
  });
}
