import React from 'react';
import type { GetServerSidePropsContext } from 'next';
import { DateFormat } from '@/utils/lib';
import type { Post } from '@/type/Post';
import { request } from '@/utils/request';
import { MarkdownWrap } from '@/components/MarkdownWrap';
import type { LayoutFC } from '@/type/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import { extractMetaData } from '@/utils/toc';
import styles from './index.module.scss';
import { getCurrentUser } from '@/service/getCurrentUser';

type PostProps = {
  data: Post;
};

const PostDetail: LayoutFC<PostProps> = ({ data }) => {
  const { tags, content, createBy, createAt } = data;
  const postInfo = `post=>${createBy.nickname}|${DateFormat(createAt)}|${content.length}  \r\n\r\n`;
  const tagsInfo = `tags=>${(tags || []).join('|')}  \r\n\r\n`;
  const contents = content.replace(/(\r\n|\n)/, `\r\n\r\n${postInfo}${tagsInfo}`);
  const [, s] = extractMetaData(contents);
  return (
    <main className={styles.postWrap}>
      <MarkdownWrap source={s} className={styles.post} />
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