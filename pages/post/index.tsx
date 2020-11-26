import { initialProps } from '@/utils/Utils';
import { MarkdownWrap } from '@powerfulyang/components';
import React, { FC } from 'react';
import { Post } from '@/types/Post';
import { Header } from '@/components/Head';

type PostProps = {
  data: Post;
};

const Posts: FC<PostProps> = ({ data }) => {
  return (
    <>
      <Header title={data.title} />
      <MarkdownWrap source={data.content} />
    </>
  );
};

export const getServerSideProps = initialProps('posts', {
  pathVariable: (ctx) => `/${ctx.query.id}`,
});

export default Posts;
