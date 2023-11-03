import type { HttpResponse, Post } from '@/__generated__/api';
import { origin } from '@/components/Head';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import type { TOCItem } from '@/components/MarkdownContainer/TOC';
import { MarkdownTOC } from '@/components/MarkdownContainer/TOC';
import { UserLayout } from '@/layout/UserLayout';
import { serverApi } from '@/request/requestTool';
import type { LayoutFC } from '@/types/GlobalContext';
import { extractRequestHeaders } from '@/utils/extractRequestHeaders';
import { generateTOC } from '@/utils/toc';
import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styles from './index.module.scss';

type PostProps = {
  post: Post;
  toc: TOCItem[];
};

const PostDetail: LayoutFC<PostProps> = ({ post: { content, id, logs = [] }, toc }) => {
  const router = useRouter();

  useHotkeys(
    '., 。',
    () => {
      return router.push(`/post/publish?id=${id}`);
    },
    [router, id],
  );

  return (
    <main className={styles.postWrap}>
      <MarkdownContainer source={content} className={styles.post} />
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

  const requestHeaders = extractRequestHeaders(ctx.req.headers);

  const res = await serverApi
    .queryPublicPostById(
      Number(postId),
      {
        versions: [],
      },
      {
        headers: requestHeaders,
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

export const runtime = 'experimental-edge';
