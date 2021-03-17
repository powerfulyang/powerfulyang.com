import { DateFormat, initialProps } from '@/utils/Utils';
import { MarkdownWrap } from '@powerfulyang/components';
import React, { FC } from 'react';
import { Post } from '@/types/Post';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import './index.module.scss';

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
      <MarkdownWrap className="post" source={contents} />
    </GlobalContextProvider>
  );
};

export const getServerSideProps = initialProps('posts', {
  pathVariable: (ctx) => `/${ctx.query.id}`,
});

export default Posts;
