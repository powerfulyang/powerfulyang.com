import { initialProps } from '@/utils/Utils';
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
  return (
    <GlobalContextProvider>
      <Header title={data.title} />
      <MarkdownWrap className="post" source={data.content} />
    </GlobalContextProvider>
  );
};

export const getServerSideProps = initialProps('posts', {
  pathVariable: (ctx) => `/${ctx.query.id}`,
});

export default Posts;
