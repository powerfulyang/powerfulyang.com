import React from 'react';
import type { GetServerSideProps } from 'next';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import type { TOCItem } from '@/components/MarkdownContainer/TOC';
import { MarkdownTOC } from '@/components/MarkdownContainer/TOC';
import { useHistory } from '@/hooks/useHistory';
import { generateTOC } from '@/utils/toc';
import { useHotkeys } from 'react-hotkeys-hook';
import { origin } from '@/components/Head';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/Skeleton';
import type { HttpResponse, Post } from '@/__generated__/api';
import { serverApi } from '@/request/requestTool';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
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
  const history = useHistory();

  useHotkeys(
    '., 。',
    () => {
      return history.pushState(`/post/publish/${id}`);
    },
    [history, id],
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
