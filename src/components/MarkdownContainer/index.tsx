import type { FC } from 'react';
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import rehypeSlug from 'rehype-slug';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'remark-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import type { TocItem } from '@/components/MarkdownContainer/Toc';
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
  onGenerateToc?: (toc: TocItem[]) => void;
};

export const MarkdownContainer: FC<MarkdownContainerProps> = ({
  source,
  className,
  blur = true,
  onGenerateToc,
}) => {
  const initialContext = useMemo(() => ({ blur }), [blur]);
  return useMemo(() => {
    return (
      <MDContainerContext.Provider value={initialContext}>
        <ReactMarkdown
          className={classNames(styles.markdownBody, className)}
          remarkPlugins={[remarkGfm, remarkParse, remarkStringify, remarkFrontmatter]}
          rehypePlugins={[
            rehypeSlug,
            () => {
              return (tree) => {
                const toc: TocItem[] = [];
                visit(tree, 'element', (node) => {
                  if (/^h(\d+)$/.test(node.tagName)) {
                    const level = Number(node.tagName.slice(1));
                    const id = node.properties?.id;
                    const title = toString(node);
                    toc.push({
                      level,
                      id,
                      title,
                    });
                  }
                });
                onGenerateToc?.(toc);
              };
            },
          ]}
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
          {source}
        </ReactMarkdown>
      </MDContainerContext.Provider>
    );
  }, [initialContext, className, source, onGenerateToc]);
};
