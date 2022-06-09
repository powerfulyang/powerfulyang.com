import type { FC } from 'react';
import React, { startTransition, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classNames from 'classnames';
import rehypeSlug from 'rehype-slug';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkStringify from 'remark-stringify';
import { parse } from 'yaml';
import { DateFormat } from '@/utils/lib';
import { copyToClipboardAndNotify } from '@/utils/copy';
import { Icon } from '@powerfulyang/components';
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
  Pre,
  Table,
  Ul,
} from './MarkdownElement';
import styles from './index.module.scss';

export type MarkdownContainerProps = {
  source: string;
  className?: string;
  blur?: boolean;
  onGenerateMetadata?: (metadata: Record<string, any>) => void;
};

export const MarkdownContainer: FC<MarkdownContainerProps> = ({
  source,
  className,
  blur = true,
  onGenerateMetadata,
}) => {
  const initialContext = useMemo(() => ({ blur }), [blur]);
  return useMemo(() => {
    return (
      <MDContainerContext.Provider value={initialContext}>
        <ReactMarkdown
          className={classNames(styles.markdownBody, className)}
          remarkPlugins={[
            remarkGfm,
            remarkParse,
            remarkStringify,
            remarkFrontmatter,
            () => {
              return (draft) => {
                const { children } = draft;
                const yamlPart = children.find((child: any) => child.type === 'yaml');
                if (yamlPart) {
                  const formatted = [];
                  try {
                    const metadata = (parse(yamlPart?.value || '') || {}) as {
                      date?: string;
                      author?: string;
                      title?: string;
                      tags?: string[];
                    };
                    process.nextTick(() => {
                      startTransition(() => {
                        onGenerateMetadata?.(metadata);
                      });
                    });
                    const {
                      date = new Date(),
                      author = 'powerfulyang',
                      title = 'No title',
                      tags = [],
                    } = metadata;
                    yamlPart.children = [];
                    formatted.push({
                      type: 'heading',
                      depth: 1,
                      children: [
                        {
                          type: 'text',
                          value: title,
                        },
                      ],
                    });
                    formatted.push({
                      type: 'info',
                      children: [
                        {
                          type: 'text',
                          value: `Published by ${author} on ${DateFormat(date)}`,
                        },
                      ],
                    });
                    formatted.push({
                      type: 'tags',
                      children: tags.map((tag) => ({
                        type: 'text',
                        value: tag,
                      })),
                    });
                    draft.children = [...formatted, ...children];
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    console.error(e);
                  }
                }
              };
            },
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
          rehypePlugins={[rehypeSlug]}
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
      </MDContainerContext.Provider>
    );
  }, [initialContext, className, source, onGenerateMetadata]);
};

export default MarkdownContainer;
