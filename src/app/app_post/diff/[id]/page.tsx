import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import React from 'react';
import type { HttpResponse, Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import PostDiff from './diff';

type Params = {
  params: {
    id: string;
  };
  searchParams: {
    versions: string[];
  };
};

const Diff: FC<Params> = async ({ params: { id }, searchParams: { versions } }) => {
  const res = await serverApi
    .queryPublicPostById(
      Number(id),
      {
        versions,
      },
      {
        headers: extractRequestHeaders(headers()),
      },
    )
    .catch((r: HttpResponse<Post>) => r);
  if (!res.ok) {
    notFound();
  }
  const post = res.data;
  const { logs } = post;
  if (logs.length !== 2) {
    notFound();
  }
  const left = logs[1];
  const right = logs[0];

  return <PostDiff left={left} right={right} />;
};

export default Diff;
