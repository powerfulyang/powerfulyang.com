import { describe, it, expect } from '@jest/globals';
import { prettify } from '@/prettier/prettifyOnClient';

describe('prettier', () => {
  it('json', async () => {
    const result = await prettify('json', '{"a":1}');
    expect(result).toBe('{\n  "a": 1\n}');
  });

  it('html', async () => {
    const result = await prettify(
      'html',
      '<div class="awesome" style="border: 1px solid red"><label for="name">Enter your name: </label><input type="text" id="name" /></div><p>Enter your HTML here</p>',
    );
    expect(result).toBe(
      '<div class="awesome" style="border: 1px solid red">\n' +
        '  <label for="name">Enter your name: </label><input type="text" id="name" />\n' +
        '</div>\n' +
        '<p>Enter your HTML here</p>\n',
    );
  });

  it('css', async () => {
    const result = await prettify('css', '.awesome { border: 1px solid red; }');
    expect(result).toBe(`.awesome {\n  border: 1px solid red;\n}\n`);
  });

  it('nginx', async () => {
    const result = await prettify('nginx', 'server { listen 80; server_name example.com; }');
    expect(result).toBe(`server {\n    listen      80;\n    server_name example.com;\n}`);
  });

  it('markdown', async () => {
    const result = await prettify(
      'markdown',
      '以下是一个使用 webpack 实现类似 Vite 的 `module?url` 功能的简单指南：\n\n\n\n\n1. **使用 `file-loader` 或 `asset/resource`（在 Webpack 5 中）**:\n2. 用 webpack 实现类似 Vite 的 `module?url` 功能的简单指南\n3. 作为内联模块。这在处理工作者和其他需要 URL 的场景中非常有用。\n  + hello\n  + heelo\n    + 11123\n    - sasd',
    );
    expect(result).toBe(
      '以下是一个使用 webpack 实现类似 Vite 的 `module?url` 功能的简单指南：\n' +
        '\n' +
        '1. **使用 `file-loader` 或 `asset/resource`（在 Webpack 5 中）**:\n' +
        '2. 用 webpack 实现类似 Vite 的 `module?url` 功能的简单指南\n' +
        '3. 作为内联模块。这在处理工作者和其他需要 URL 的场景中非常有用。\n' +
        '\n' +
        '- hello\n' +
        '- heelo\n' +
        '  - 11123\n' +
        '  * sasd\n',
    );
  });
});
