import type { FC } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import {
  BlockQuote,
  Code,
  H1,
  H2,
  H3,
  H4,
  Img,
  Li,
  Link,
  Paragraph,
  Pre,
  Table,
  Ul,
} from './MarkdownElement';
import styles from './index.module.scss';
import { DateFormat } from '@/utils/lib';
import { extractMetaData } from '@/utils/toc';

export type MarkdownContainerProps = {
  source: string;
  className?: string;
};

export const MarkdownContainer: FC<MarkdownContainerProps> = ({ source, className }) => {
  const [metadata, s] = extractMetaData(source);
  const postInfo = `post=>${metadata.author}|${DateFormat(metadata.date)}  \r\n\r\n`;
  const tagsInfo = `tags=>${(metadata.tags || []).join('|')}  \r\n\r\n`;
  const content = s.replace(/(\r\n|\n)/, `\r\n\r\n${postInfo}${tagsInfo}`);

  return (
    <ReactMarkdown
      className={classNames(styles.markdownBody, className)}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        blockquote: BlockQuote,
        table: Table,
        p: Paragraph,
        a: Link,
        code: Code,
        pre: Pre,
        li: Li,
        ul: Ul,
        img: Img,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
