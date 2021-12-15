import React from 'react';
import type { GetServerSidePropsContext } from 'next';
import type { Post } from '@/type/Post';
import { request } from '@/utils/request';
import { MarkdownContainer } from '@/components/MarkdownContainer';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';
import { MarkdownToc } from '@/components/MarkdownContainer/Toc';

type PostProps = {
  data: Post;
};

const PostDetail: LayoutFC<PostProps> = ({ data }) => {
  const { content } = data;

  return (
    <main className={styles.postWrap}>
      <MarkdownContainer source={content} className={styles.post} />
      <MarkdownToc content={content} />
      <div style={{ clear: 'both' }} />
    </main>
  );
};

PostDetail.getLayout = (page) => {
  const { pathViewCount, user } = page.props;
  return (
    <UserLayout user={user} pathViewCount={pathViewCount}>
      {page}
    </UserLayout>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const {
    query: { id },
  } = ctx;
  const res = await request(`/public/post/${id}`, { ctx });
  const { data, pathViewCount } = await res.json();
  const user = await getCurrentUser(ctx);
  return {
    props: { data, pathViewCount, title: data.title, user },
  };
};

export default PostDetail;
