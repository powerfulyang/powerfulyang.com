import { extractTitle, generateToc } from '@/utils/toc';

describe('markdown toc', () => {
  it('generate toc', () => {
    const res = generateToc(
      '# Markdown syntax guide\n' +
        '## Headers\n' +
        '# This is a Heading h1\n' +
        '## This is a Heading h2\n' +
        '### This is a Heading h3\n' +
        '#### This is a Heading h4\n' +
        '**最多只支持到H4**\n' +
        '## Emphasis\n' +
        '*This text will be italic*\n' +
        '_This will also be italic_\n' +
        '\n' +
        '**This text will be bold**\n' +
        '__This will also be bold__\n' +
        '\n' +
        '_You **can** combine them_\n' +
        '\n' +
        '## Lists\n' +
        '\n' +
        '### Unordered\n' +
        '\n' +
        '* Item 1\n' +
        '* Item 2\n' +
        '* Item 2a\n' +
        '* Item 2b\n' +
        '\n' +
        '### Ordered\n' +
        '\n' +
        '1. Item 1\n' +
        '1. Item 2\n' +
        '1. Item 3\n' +
        '\n' +
        '### Checked List\n' +
        '\n' +
        '- [x] 你好\n' +
        '- [ ] 我们\n' +
        '\n' +
        '## Images\n' +
        '\n' +
        '![This is a alt text.](/7eec872d17b81f03fcf7834900436ae6c1dccb99.webp "图片title")\n' +
        '\n' +
        '## Links\n' +
        '\n' +
        'You may be using [admin manage page](https://admin.powerfulyang.com/).\n' +
        '\n' +
        '## Blockquotes\n' +
        '\n' +
        '> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.\n' +
        '>\n' +
        '>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.\n' +
        '\n' +
        '## Tables\n' +
        '\n' +
        '| Left columns  | Right columns |\n' +
        '| ------------- |:-------------:|\n' +
        '| left foo      | right foo     |\n' +
        '| left bar      | right bar     |\n' +
        '| left baz      | right baz     |\n' +
        '\n' +
        '## Blocks of code\n' +
        '\n' +
        '```js\n' +
        "let message = 'Hello world';\n" +
        'alert(message);\n' +
        '```\n' +
        '\n' +
        '## Inline code\n' +
        '\n' +
        'This web site is using `markedjs/marked`.',
    );

    expect(res).toBeDefined();
  });

  it('extract header ', function () {
    const t = '## Headers\n';
    const reg = /#{1,4}\s(.+)\n/g;
    const v = reg.exec(t);
    expect(v).toBeDefined();
  });

  it('extract title', () => {
    const title = extractTitle(
      '# Markdown syntax guide\n' +
        '## Headers\n' +
        '# This is a Heading h1\n' +
        '## This is a Heading h2\n' +
        '### This is a Heading h3\n' +
        '#### This is a Heading h4\n',
    );
    expect(title).toBe('Markdown syntax guide');
  });
});
