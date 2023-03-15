import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import type React from 'react';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { parse } from 'yaml';
import { DateFormat } from '@/utils/lib';

export const remarkMetadata: Plugin<any, Root, string> = (
  metadataRef?: React.MutableRefObject<MarkdownMetadata>,
) => {
  return (draft: any) => {
    const { children } = draft;
    const yamlPart = children.find((child: any) => child.type === 'yaml');
    if (yamlPart) {
      const formatted = [];
      try {
        const metadata: MarkdownMetadata = parse(yamlPart?.value || '') || {};
        process.nextTick(() => {
          // eslint-disable-next-line no-param-reassign
          metadataRef && (metadataRef.current = metadata);
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
};
