import { DateFormat } from '@/utils/lib';
import React from 'react';
import { Post } from '@/types/Post';
import { request } from '@/utils/request';
import { GetServerSidePropsContext } from 'next';
import { MarkdownWrap } from '@/components/MarkdownWrap';
import { LayoutFC } from '@/types/GlobalContext';
import { UserLayout } from '@/layout/UserLayout';
import styles from './index.module.scss';

type PostProps = {
  data: Post;
};

const PostDetail: LayoutFC<PostProps> = ({ data }) => {
  const { tags, content, createBy, createAt } = data;
  const postInfo = `post=>${createBy.nickname}|${DateFormat(createAt)}|${content.length}  \r\n\r\n`;
  const tagsInfo = `tags=>${(tags || []).join('|')}  \r\n\r\n`;
  const contents = content.replace(/(\r\n|\n)/, `\r\n\r\n${postInfo}${tagsInfo}`);
  return (
    <main className={styles.post_wrap}>
      <MarkdownWrap source={contents} className={styles.post} />
    </main>
  );
};

PostDetail.getLayout = (page) => {
  const { pathViewCount } = page.props;
  return <UserLayout pathViewCount={pathViewCount}>{page}</UserLayout>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const {
    query: { id },
  } = ctx;
  const res = await request(`/public/post/${id}`, { ctx });
  const { data, pathViewCount } = await res.json();
  return {
    props: { data, pathViewCount },
  };
};

export default PostDetail;
