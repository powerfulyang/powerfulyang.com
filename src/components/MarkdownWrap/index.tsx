import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import { BlockQuote, Code, H1, Link, Paragraph, Pre, Table } from './MarkdownElement';
import styles from './index.module.scss';

export type MarkdownWrapProps = {
  source: string;
  className?: string;
};

export const MarkdownWrap: FC<MarkdownWrapProps> = ({ source, className }) => {
  return (
    <div className={styles.wrap}>
      <ReactMarkdown
        className={classNames(styles.markdown_body, className)}
        remarkPlugins={[remarkGfm]}
        components={{
          h1: H1,
          blockquote: BlockQuote,
          table: Table,
          p: Paragraph,
          a: Link,
          code: Code,
          pre: Pre,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
};
