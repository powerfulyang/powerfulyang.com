import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { FC } from 'react';
import React from 'react';
import { UsePostPublish } from '@/hooks/usePostPublish';
import { generateTOC } from '@/utils/toc';
import { MarkdownTOC } from '@/components/MarkdownContainer/TOC';
import { Skeleton } from '@/components/Skeleton';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import styles from '@/pages/post/[id]/index.module.scss';

const LazyMarkdownContainer = dynamic(() => import('@/components/MarkdownContainer'), {
  loading: () => {
    return <Skeleton rows={8} className={styles.post} />;
  },
});

type Params = {
  params: {
    id: string;
  };
};

const PostDetail: FC<Params> = async ({ params: { id } }) => {
  const {
    data: { content, logs },
  } = await serverApi
    .queryPublicPostById(
      Number(id),
      {
        versions: [],
      },
      {
        headers: extractRequestHeaders(headers()),
      },
    )
    .catch(() => {
      notFound();
    });

  const toc = await generateTOC(content);

  return (
    <main className={styles.postWrap}>
      <UsePostPublish id={id} />
      <LazyMarkdownContainer source={content} className={styles.post} />
      <MarkdownTOC app_folder toc={toc} logs={logs} id={id} />
    </main>
  );
};

export default PostDetail;
