import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import { BlockQuote, H1, Link, Paragraph, Table } from './MarkdownElement';
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
        plugins={[remarkGfm]}
        components={{
          h1: H1,
          blockquote: BlockQuote,
          table: Table,
          p: Paragraph as any,
          a: Link,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
};
