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
});
