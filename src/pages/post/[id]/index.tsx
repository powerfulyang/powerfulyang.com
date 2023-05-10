import type { HttpResponse, Post } from '@/__generated__/api';
import { origin } from '@/components/Head';
import type { TOCItem } from '@/components/MarkdownContainer/TOC';
import { MarkdownTOC } from '@/components/MarkdownContainer/TOC';
import { Skeleton } from '@/components/Skeleton';
import { UserLayout } from '@/layout/UserLayout';
import { serverApi } from '@/request/requestTool';
import type { LayoutFC } from '@/type/GlobalContext';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { generateTOC } from '@/utils/toc';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styles from './index.module.scss';

const LazyMarkdownContainer = dynamic(() => import('@/components/MarkdownContainer'), {
  loading: () => {
    return <Skeleton rows={8} className={styles.post} />;
  },
});

type PostProps = {
  post: Post;
  toc: TOCItem[];
};

const PostDetail: LayoutFC<PostProps> = ({ post: { content, id, logs = [] }, toc }) => {
  const router = useRouter();

  useHotkeys(
    '., 。',
    () => {
      return router.push(`/post/publish/${id}`);
    },
    [router, id],
  );

  return (
    <main className={styles.postWrap}>
      <LazyMarkdownContainer source={content} className={styles.post} />
      <MarkdownTOC toc={toc} logs={logs} id={id} />
    </main>
  );
};

PostDetail.getLayout = (page) => {
  const { pathViewCount } = page.props.layout;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { id },
  } = ctx;
  const postId = id as string;
  const res = await serverApi
    .queryPublicPostById(
      Number(postId),
      {
        versions: [],
      },
      {
        headers: extractRequestHeaders(ctx.req.headers),
      },
    )
    .catch((r: HttpResponse<Post>) => {
      return r;
    });
  if (!res.ok) {
    return {
      notFound: true,
    };
  }
  const pathViewCount = res.headers.get('x-path-view-count');
  const { data } = res;

  const toc = await generateTOC(data.content);

  return {
    props: {
      post: data,
      toc,
      layout: {
        pathViewCount,
      },
      meta: {
        title: data.title,
        description: data.summary,
      },
      link: {
        canonical: `${origin}/post/${data.id}`,
      },
    },
  };
};

export default PostDetail;
