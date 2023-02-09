import ReactDiffViewer from 'react-diff-viewer';
import type { GetServerSideProps } from 'next';
import { requestAtServer } from '@/utils/server';
import type { Post } from '@/type/Post';
import type { FC } from 'react';
import React from 'react';
import { DateTimeFormat } from '@/utils/lib';
import { PrismAsync } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { StatusCodes } from 'http-status-codes';

type Props = {
  left: Post;
  right: Post;
};

const Diff: FC<Props> = ({ left, right }) => {
  const leftTitle = `${left.title} @ ${DateTimeFormat(left.createAt)}`;
  const rightTitle = `${right.title} @ ${DateTimeFormat(right.createAt)}`;
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
      }}
      renderContent={(value) => {
        return (
          <PrismAsync
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
          </PrismAsync>
        );
      }}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const id = query.id as string;
  const versions = query.versions as string[];
  const res = await requestAtServer(`/public/post/${id}`, {
    ctx,
    query: {
      versions,
    },
  });
  if (res.status !== StatusCodes.OK) {
    return {
      notFound: true,
    };
  }
  const post = await res.json();
  const { logs } = post;

  return {
    props: {
      left: logs[1],
      right: logs[0],
      meta: {
        title: 'Post Diff',
        description: '对比两个版本的文章',
      },
    },
  };
};

export default Diff;
