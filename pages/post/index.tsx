import { DateFormat, initialProps } from '@/utils/Utils';
import { MarkdownWrap } from '@powerfulyang/components';
import React, { FC } from 'react';
import { Post } from '@/types/Post';
import { Header } from '@/components/Head';
import { GlobalContextProvider } from '@/context/GlobalContextProvider';
import './index.scss';

type PostProps = {
  data: Post;
};

const Posts: FC<PostProps> = ({ data }) => {
  const { tags, pathViewCount, content, user, createAt } = data;
  const postInfo = `post=>${user.nickname}|${DateFormat(createAt)}|${
    content.length
  }|${pathViewCount}  \n`;
  const tagsInfo = `tags=>${(tags || []).join('|')}  \n`;
  const contents = content.replace('\n', `\n${postInfo}${tagsInfo}`);
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
