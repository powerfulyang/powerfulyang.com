'use client';

import type { FC } from 'react';
import React from 'react';
import ReactDiffViewer from 'react-diff-viewer';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDateTime } from '@/utils/lib';
import type { PostLog } from '@/__generated__/api';

const Diff: FC<{ left: PostLog; right: PostLog }> = ({ left, right }) => {
  const leftTitle = `${left.title} @ ${formatDateTime(left.createdAt)}`;
  const rightTitle = `${right.title} @ ${formatDateTime(right.createdAt)}`;

  return (
    <ReactDiffViewer
      leftTitle={leftTitle}
      rightTitle={rightTitle}
      oldValue={left.content}
      newValue={right.content}
      styles={{
        wordDiff: {
          display: 'contents',
        },
        wordRemoved: {
          display: 'inline',
        },
        wordAdded: {
          display: 'inline',
        },
        diffContainer: {
          width: 'calc(100vw - 6px)',
          pre: {
            fontFamily: 'inherit',
          },
        },
        content: {
          width: 'calc(50vw - 6px - 50px - 25px)',
        },
        contentText: {
          span: {
            fontFamily: 'inherit !important',
          },
          code: {
            fontFamily: 'inherit !important',
          },
        },
      }}
      renderContent={(value) => {
        return (
          <Prism
            style={coy}
            language="markdown"
            wrapLongLines
            wrapLines
            PreTag="span"
            customStyle={{
              display: 'contents',
              wordBreak: 'break-word',
            }}
            codeTagProps={{
              style: {
                display: 'contents',
              },
            }}
          >
            {value}
          </Prism>
        );
      }}
    />
  );
};
export default Diff;
