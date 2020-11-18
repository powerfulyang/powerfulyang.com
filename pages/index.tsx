import React, { FC } from 'react';
import { Header } from '@/components/Head';
import { MarkdownWrap } from '@powerfulyang/components';
import './index.scss';

type IndexProps = {};
export const Index: FC<IndexProps> = () => {
  const mdContent = `
# Markdown syntax guide

## Headers

# This is a Heading h1
## This is a Heading h2
###### This is a Heading h6

## Emphasis

*This text will be italic*
_This will also be italic_

**This text will be bold**
__This will also be bold__

_You **can** combine them_

## Lists

### Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b

### Ordered

1. Item 1
1. Item 2
1. Item 3
  1. Item 3a
  1. Item 3b

## Images

![This is a alt text.](/7eec872d17b81f03fcf7834900436ae6c1dccb99.webp "This is a sample image.")

## Links

You may be using [admin manage page](https://admin.powerfulyang.com/).

## Blockquotes

> Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
>
>> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

## Tables

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | right foo     |
| left bar      | right bar     |
| left baz      | right baz     |

## Blocks of code

\`\`\`
let message = 'Hello world';
alert(message);
\`\`\`

## Inline code

This web site is using \`markedjs/marked\`.`;
  return (
    <>
      <Header />
      <MarkdownWrap source={mdContent} />
    </>
  );
};

export default Index;
