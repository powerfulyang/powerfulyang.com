'use client';

import type { FC } from 'react';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import rehypeSlug from 'rehype-slug';
import remarkFrontmatter from 'remark-frontmatter';
import { Icon } from '@powerfulyang/components';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { remarkDirectiveHandle } from '@/components/MarkdownContainer/plugins/remarkDirectiveHandle';
import { remarkMetadata } from '@/components/MarkdownContainer/plugins/remarkMetadata';
import { A, BlockQuote, Code, H1, H2, H3, H4, Img, Li, Pre, Table, Ul } from './MarkdownElement';
import rehypeRaw from './plugins/rehypeRaw';

import styles from './index.module.scss';
// `rehype-katex` does not import the CSS for you
import 'katex/dist/katex.min.css';

export type MarkdownContainerProps = {
  source: string;
  className?: string;
  metadataRef?: React.MutableRefObject<MarkdownMetadata>;
};

export const MarkdownContainer: FC<MarkdownContainerProps> = (
  { source, className, metadataRef },
) => {
  return (
    <ReactMarkdown
      className={classNames(styles.markdownBody, className)}
      remarkPlugins={[
        remarkGfm,
        remarkFrontmatter,
        [remarkMetadata, metadataRef],
        remarkMath,
        remarkDirective,
        remarkDirectiveHandle,
      ]}
      remarkRehypeOptions={{
        passThrough: ['info', 'tags'],
        handlers: {
          info(h, node) {
            return h(
              node,
              'p',
              {
                className: styles.postInfo,
              },
              node.children,
            );
          },
          tags(h, node) {
            return h(node, 'tags', {}, node.children);
          },
        },
      }}
      rehypePlugins={[rehypeSlug, rehypeKatex, rehypeRaw]}
      components={{
        h1: H1,
        h2: H2,
        h3: H3,
        h4: H4,
        blockquote: BlockQuote,
        table: Table,
        a: A,
        code: Code,
        pre: Pre,
        li: Li,
        ul: Ul,
        img: Img,
        // @ts-ignore
        // eslint-disable-next-line react/no-unstable-nested-components
        tags({ children }) {
          return (
            <div className="flex flex-wrap sm:ml-2 lg:ml-6">
              {children?.map((tag: string) => (
                <button
                  type="button"
                  key={tag}
                  className="pointer my-2 mr-2"
                  onClick={() => copyToClipboardAndNotify(tag)}
                >
                  <Icon type="icon-tag" className="text-xl" />
                  <span className="text-sm text-[#FFB356]">{tag}</span>
                </button>
              ))}
            </div>
          );
        },
      }}
    >
      {source}
    </ReactMarkdown>
  );
};

export default MarkdownContainer;
