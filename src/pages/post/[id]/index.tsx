import type {HttpResponse, Post} from '@/__generated__/api';
import {origin} from '@/components/Head';
import {MarkdownContainer} from '@/components/MarkdownContainer';
import type {TOCItem} from '@/components/MarkdownContainer/TOC';
import {MarkdownTOC} from '@/components/MarkdownContainer/TOC';
import {UserLayout} from '@/layout/UserLayout';
import {serverApi} from '@/request/requestTool';
import type {LayoutFC} from '@/types/GlobalContext';
import {generateTOC} from '@/utils/toc';
import type {GetStaticPaths, GetStaticProps} from 'next';
import {useRouter} from 'next/navigation';

import {useHotkeys} from 'react-hotkeys-hook';
import styles from './index.module.scss';

type PostProps = {
  post: Post;
  toc: TOCItem[];
};

const PostDetail: LayoutFC<PostProps> = ({post: {content, id, logs = []}, toc}) => {
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
      <MarkdownContainer source={content} className={styles.post}/>
      <MarkdownTOC toc={toc} logs={logs} id={id}/>
    </main>
  );
};

PostDetail.getLayout = (page) => {
  return <UserLayout>{page}</UserLayout>;
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {id} = params as { id: string };
  const postId = id as string;

  const res = await serverApi
    .queryPublicPostById(
      Number(postId),
      {
        versions: [],
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
  const {data} = res;

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

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await serverApi.infiniteQueryPublicPost({
    nextCursor: 0,
    take: 1000,
  });
  const {data} = res;
  return {
    paths: data.resources.map((post: Post) => ({
      params: {id: post.id.toString()},
    })),
    fallback: false,
  };
};

export default PostDetail;

// export const runtime = 'experimental-edge'
