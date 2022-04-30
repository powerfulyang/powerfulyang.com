import type { FC } from 'react';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import { DateFormat } from '@/utils/lib';
import { extractMetaData } from '@/utils/toc';
import {
  A,
  BlockQuote,
  Code,
  H1,
  H2,
  H3,
  H4,
  Img,
  Li,
  MDContainerContext,
  Paragraph,
  Pre,
  Table,
  Ul,
} from './MarkdownElement';
import styles from './index.module.scss';

export type MarkdownContainerProps = {
  source: string;
  className?: string;
  blur?: boolean;
};

export const MarkdownContainer: FC<MarkdownContainerProps> = ({
  source,
  className,
  blur = true,
}) => {
  const [metadata, s] = extractMetaData(source);
  const postInfo = `post=>${metadata.author}|${DateFormat(metadata.date)}  \r\n\r\n`;
  const tagsInfo = `tags=>${(metadata.tags || []).join('|')}  \r\n\r\n`;
  const content = s.replace(/(\r\n|\n)/, `\r\n\r\n${postInfo}${tagsInfo}`);

  const initialContext = useMemo(() => ({ blur }), [blur]);
  return (
    <MDContainerContext.Provider value={initialContext}>
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
          a: A,
          code: Code,
          pre: Pre,
          li: Li,
          ul: Ul,
          img: Img,
        }}
      >
        {content}
      </ReactMarkdown>
    </MDContainerContext.Provider>
  );
};
