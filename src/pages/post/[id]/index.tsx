import React from 'react';
import type { GetServerSideProps } from 'next';
import type { Post } from '@/type/Post';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { MarkdownTOC } from '@/components/MarkdownContainer/TOC';
import { useHistory } from '@/hooks/useHistory';
import { requestAtServer } from '@/utils/server';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import { generateTOC } from '@/utils/toc';
import { useHotkeys } from 'react-hotkeys-hook';
import { StatusCodes } from 'http-status-codes';
import { defaultAuthor, origin } from '@/components/Head';
import styles from './index.module.scss';

type PostProps = {
  data: Post;
};

const PostDetail: LayoutFC<PostProps> = ({ data: { content, toc, id, logs = [] } }) => {
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
  const res = await requestAtServer(`/public/post/${postId}`, { ctx });
  if (res.status !== StatusCodes.OK) {
    return {
      notFound: true,
    };
  }
  const pathViewCount = res.headers.get('x-path-view-count');
  const data = (await res.json()) as Post;

  const toc = await generateTOC(data.content);

  return {
    props: {
      data: {
        ...data,
        toc,
      },
      layout: {
        pathViewCount,
      },
      meta: {
        title: data.title,
        description: data.summary,
        keywords: data.tags.join(', '),
        author: data.createBy?.nickname || defaultAuthor,
      },
      link: {
        canonical: `${origin}/post/${data.id}`,
      },
    },
  };
};

export default PostDetail;
