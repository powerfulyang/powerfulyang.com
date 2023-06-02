import ReactDiffViewer from 'react-diff-viewer';
import type { GetServerSideProps } from 'next';
import type { FC } from 'react';
import React from 'react';
import { formatDateTime } from '@/utils/lib';
import { Prism } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { HttpResponse, Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';

type Props = {
  left: Post;
  right: Post;
};

const Diff: FC<Props> = ({ left, right }) => {
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { query } = ctx;
  const id = query.id as string;
  const versions = query.versions as string[];
  const res = await serverApi
    .queryPublicPostById(
      Number(id),
      {
        versions,
      },
      {
        headers: extractRequestHeaders(ctx.req.headers),
      },
    )
    .catch((r: HttpResponse<Post>) => r);
  if (!res.ok) {
    return {
      notFound: true,
    };
  }
  const post = res.data;
  const { logs } = post;
  if (logs.length !== 2) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      left: logs[1],
      right: logs[0],
      meta: {
        title: `Post [${post.id}-${logs[0].id}-${logs[1].id}] Diff`,
        description: '对比两个版本的文章',
        noindex: true,
        nofollow: true,
      },
    },
  };
};

export default Diff;
