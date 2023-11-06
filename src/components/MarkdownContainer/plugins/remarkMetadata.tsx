import type React from 'react';
import { parse } from 'yaml';
import type { MarkdownMetadata } from '@/components/MarkdownContainer/LiveMarkdownEditor';
import { formatDate } from '@/utils/format';

export const remarkMetadata = ((metadataRef?: React.MutableRefObject<MarkdownMetadata>) => {
  return (draft: any) => {
    const { children } = draft;
    const yamlPart = children.find((child: any) => child.type === 'yaml');
    if (yamlPart) {
      const formatted = [];
      try {
        const metadata: MarkdownMetadata = parse(yamlPart?.value || '') || {};
        queueMicrotask(() => {
          // eslint-disable-next-line no-param-reassign
          metadataRef && (metadataRef.current = metadata);
        });
        const {
          date = new Date(),
          author = 'powerfulyang',
          title = 'No title',
          tags = [],
          summary = '',
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
              value: `Published by ${author} on ${formatDate(date)}`,
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
        if (summary) {
          formatted.push({
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: summary,
              },
            ],
          });
        }
        draft.children = [...formatted, ...children];
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  };
}) as any;
