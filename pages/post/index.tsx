import { DateFormat } from '@/utils/Utils';
import React, { FC } from 'react';
import { Post } from '@/types/Post';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import { request } from '@/utils/request';
import { GetServerSidePropsContext } from 'next';

type PostProps = {
  data: Post;
};

const Posts: FC<PostProps> = ({ data }) => {
  const { tags, pathViewCount, content, user, createAt } = data;
  const postInfo = `post=>${user.nickname}|${DateFormat(createAt)}|${
    content.length
  }|${pathViewCount}|${user.avatar}  \r\n\r\n`;
  const tagsInfo = `tags=>${(tags || []).join('|')}  \r\n\r\n`;
  const contents = content.replace(/(\r\n|\n)/, `\r\n\r\n${postInfo}${tagsInfo}`);
  return (
    <GlobalContextProvider>
      <Header title={data.title} />
      {contents}
    </GlobalContextProvider>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const {
    query: { id },
  } = ctx;
  const res = await request(`/posts/${id}`, { ctx });
  const { data } = await res.json();
  return {
    props: { data },
  };
};

export default Posts;
